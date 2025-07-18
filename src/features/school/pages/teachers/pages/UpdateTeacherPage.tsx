import { useMutation, useQuery } from "@apollo/client";
import { Form } from "@heroui/form";
import {
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { twMerge } from "tailwind-merge";

import { GRADES_BY_SCHOOL_QUERY } from "../../../services/queries";
import { GradeAndSection } from "../components";
import {
  CreateTeacherSchema,
  type CreateTeacherSchemaType,
} from "../schemas/createTeacherSchema";
import { UPDATE_TEACHER_MUTATION } from "../services/teacherMutations";
import { TEACHER_QUERY } from "../services/teacherQueries";

import { FormWrapper, PageWrapper } from "@/components";
import { title } from "@/components/primitives";
import {
  BreadcrumbNav,
  Button,
  DEFAULT_ROW_STYLES,
  Input,
  PhoneInput,
  Table,
} from "@/components/ui";
import { handleApolloError } from "@/core/errors";
import { omitKeys } from "@/core/utils/object";
import type { GradesBySchoolQueryResponse } from "@/features/school/services/types";
import { TEACHERS_QUERY } from "@/features/teachers/services/teachersQuery";
import type {
  TeacherQueryResponse,
  UpdateTeacherResponse,
} from "../services/types";

const gradesTableColumns = [
  { name: "Grade", uid: "grade" },
  { name: "Sections", uid: "sections" },
  { name: "Action", uid: "action" },
];

type UpdateTeacherPayload = {
  teacherId: string;
  input: {
    name: string;
    email: string;
    contactNumber: string;
    schoolSectionIds: string[];
  };
};

export default function UpdateTeacherPage() {
  const navigate = useNavigate();
  const { schoolId, teacherId } = useParams<{
    schoolId: string;
    teacherId: string;
  }>();

  const { data: teacherData } = useQuery<
    TeacherQueryResponse,
    { teacherId: string }
  >(TEACHER_QUERY, { variables: { teacherId: teacherId! }, skip: !teacherId });

  const [updateTeacher, { loading: isUpdatingTeacher }] = useMutation<
    UpdateTeacherResponse,
    UpdateTeacherPayload
  >(UPDATE_TEACHER_MUTATION, {
    refetchQueries: [
      { query: TEACHERS_QUERY, variables: { limit: 10, offset: 0, schoolId } },
    ],
  });

  //LIST ALL GRADES BY SCHOOL QUERY
  const { data: schoolData, loading: isLoading } = useQuery<
    GradesBySchoolQueryResponse,
    { schoolId: string }
  >(GRADES_BY_SCHOOL_QUERY, {
    variables: { schoolId: schoolId! },
    skip: !schoolId,
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateTeacherSchemaType>({
    resolver: zodResolver(CreateTeacherSchema),
    defaultValues: {
      contactNumber: "",
      email: "",
      grades: [],
      name: "",
    },
  });

  const addedGrades = useWatch({ control, name: "grades" }) || [];
  const schoolGrades = schoolData?.school?.grades || [];

  const handleUpdateTeacher = async (data: CreateTeacherSchemaType) => {
    try {
      const rest = omitKeys(data, ["grades"]);

      const schoolSectionIds = data?.grades?.flatMap((grade) =>
        grade.sections.map((section) => section.id),
      );

      const response = await updateTeacher({
        variables: {
          teacherId: teacherId!,
          input: { ...rest, schoolSectionIds },
        },
      });

      addToast({
        title: response?.data?.updateTeacher?.message,
        color: "success",
      });
      navigate("../..");
    } catch (error) {
      const errMsg = handleApolloError(error);

      addToast({ title: errMsg, color: "danger" });
    }
  };

  //FORM CANCEL HANDLER
  const handleCancel = () => {
    reset();
  };

  //ADD GRADE AND SECTIONS HANDLER
  const handleAddGradeAndSections = (
    data: CreateTeacherSchemaType["grades"][0],
  ) => {
    setValue("grades", [...addedGrades, data], { shouldValidate: true });
  };

  //DELETE GRADE HANDLER
  const handleDeleteGrade = (id: string) => {
    const newGrades = addedGrades?.filter((g) => g.id !== id);

    setValue("grades", newGrades, { shouldValidate: true });
  };

  //SET INITIAL DATA BASED ON TEACHER
  React.useEffect(() => {
    if (teacherData) {
      const { contactNumber, email, grades, name } = teacherData.teacher;

      const prevGrades = grades?.map((g) => ({
        ...g.grade,
        id: g.grade.id.toString(),
        sections: g.sections?.map((s) => ({
          ...s.section,
          id: s.id,
        })),
      }));

      reset({ name, email, contactNumber, grades: prevGrades });
    }
  }, [teacherData, reset]);

  return (
    <PageWrapper>
      <BreadcrumbNav
        items={[
          { label: "Schools", to: "../../.." },
          {
            label: schoolData?.school?.name,
            isLoading: isLoading,
            to: "../..",
          },
          {
            label: teacherData?.teacher?.name,
            isLoading: isLoading,
          },
          { label: "Update" },
        ]}
      />
      <h1 className={title({ size: "lg" })}>Update Teacher</h1>
      <FormWrapper>
        <Form className="flex flex-col gap-5" validationBehavior="aria">
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState: { error, invalid } }) => (
              <Input
                {...field}
                isRequired
                errorMessage={error?.message}
                isInvalid={invalid}
                label="Name"
                labelPlacement="outside"
                placeholder="Name"
                variant="bordered"
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState: { error, invalid } }) => (
              <Input
                {...field}
                isRequired
                errorMessage={error?.message}
                isInvalid={invalid}
                label="Email"
                labelPlacement="outside"
                placeholder="Email"
                type="email"
                variant="bordered"
              />
            )}
          />

          <Controller
            control={control}
            name="contactNumber"
            render={({ field, fieldState: { invalid, error } }) => (
              <PhoneInput
                {...field}
                isRequired
                defaultCountry="AE"
                errorMessage={error?.message}
                isInvalid={invalid}
                label="Contact Number"
              />
            )}
          />
        </Form>
        <div className="my-5">
          <GradeAndSection
            addedGrades={addedGrades}
            handleAddGradeAndSections={handleAddGradeAndSections}
            isInvalid={!!errors?.grades}
            isLoading={isLoading}
            schoolGrades={schoolGrades}
          />
          {errors?.grades && (
            <small className="text-danger text-xs">
              {errors?.grades?.message}
            </small>
          )}
        </div>
        <AnimatePresence mode="wait">
          {addedGrades?.length > 0 && (
            <motion.div
              animate={{ translateY: 0, opacity: 1 }}
              className="mb-5"
              exit={{ translateY: -100, opacity: 0 }}
              initial={{ translateY: -100, opacity: 0 }}
            >
              <Table aria-label="Grades table" bottomContentPlacement="outside">
                <TableHeader columns={gradesTableColumns}>
                  {(column) => (
                    <TableColumn
                      key={column.uid}
                      align={
                        ["action", "grade"].includes(column.uid)
                          ? "center"
                          : "start"
                      }
                    >
                      {column.name}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody emptyContent={"No data found"}>
                  {addedGrades?.map((grade) => {
                    return (
                      <TableRow
                        key={grade?.id}
                        className={twMerge(DEFAULT_ROW_STYLES)}
                      >
                        <TableCell className="w-20">{grade?.grade}</TableCell>
                        <TableCell>
                          {grade?.sections
                            ?.map((section) => section.section)
                            ?.join(", ")}
                        </TableCell>
                        <TableCell className="w-20">
                          <Button
                            isIconOnly
                            className="group-hover:text-danger data-[hover=true]:bg-default/20"
                            radius="full"
                            size="sm"
                            variant="light"
                            onPress={() => handleDeleteGrade(grade.id)}
                          >
                            <svg
                              height={16}
                              viewBox="0 0 24 24"
                              width={16}
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="m18 9l-.84 8.398c-.127 1.273-.19 1.909-.48 2.39a2.5 2.5 0 0 1-1.075.973C15.098 21 14.46 21 13.18 21h-2.36c-1.279 0-1.918 0-2.425-.24a2.5 2.5 0 0 1-1.076-.973c-.288-.48-.352-1.116-.48-2.389L6 9m7.5 6.5v-5m-3 5v-5m-6-4h4.615m0 0l.386-2.672c.112-.486.516-.828.98-.828h3.038c.464 0 .867.342.98.828l.386 2.672m-5.77 0h5.77m0 0H19.5"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                              />
                            </svg>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex w-full items-center justify-end gap-2">
          <Button
            color="default"
            isDisabled={isUpdatingTeacher}
            type="reset"
            variant="flat"
            onPress={handleCancel}
          >
            Reset
          </Button>
          <Button
            color="primary"
            isLoading={isUpdatingTeacher}
            onPress={() => {
              void handleSubmit(handleUpdateTeacher)();
            }}
          >
            Save
          </Button>
        </div>
      </FormWrapper>
    </PageWrapper>
  );
}
