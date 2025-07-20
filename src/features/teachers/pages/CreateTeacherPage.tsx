import { FormWrapper, PageWrapper } from "@/components";
import {
  Autocomplete,
  BreadcrumbNav,
  Button,
  DEFAULT_ROW_STYLES,
  Input,
  PhoneInput,
  Table,
} from "@/components/ui";
import { handleApolloError } from "@/core/errors";
import type { BusinessType } from "@/core/services/types";
import { omitKeys } from "@/core/utils/object";
import { SCHOOL_NAMES_QUERY } from "@/features/school/pages/schools/services/schoolQueries";
import type { SchoolNamesQueryResponse } from "@/features/school/pages/schools/services/types";
import { GradeAndSection } from "@/features/school/pages/teachers/components";
import type {
  CreateTeacherPayload,
  CreateTeacherResponse,
} from "@/features/school/pages/teachers/services/types";
import { CREATE_TEACHER_MUTATION } from "@/features/school/services/mutations";
import { GRADES_BY_SCHOOL_QUERY } from "@/features/school/services/queries";
import type { GradesBySchoolQueryResponse } from "@/features/school/services/types";
import { useMutation, useQuery } from "@apollo/client";
import { AutocompleteItem } from "@heroui/autocomplete";
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
import { Controller, useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";
import {
  CreateTeacherSchema,
  type CreateTeacherSchemaType,
} from "../schemas/teacherSchema";
import {
  TEACHERS_QUERY,
  TOTAL_TEACHERS_QUERY,
} from "../services/teachersQuery";

const gradesTableColumns = [
  { name: "Grade", uid: "grade" },
  { name: "Sections", uid: "sections" },
  { name: "Action", uid: "action" },
];

export default function CreateTeacherPage() {
  const navigate = useNavigate();

  //LIST ALL B2B SCHOOLS QUERY
  const { data: b2bSchools, loading: isLoadingSchools } = useQuery<
    SchoolNamesQueryResponse,
    { accountType: BusinessType }
  >(SCHOOL_NAMES_QUERY, {
    variables: { accountType: "B2B" },
  });

  //ALL SCHOOLS AND GRADES
  const schools = b2bSchools?.schools || [];

  const [createTeacher, { loading: isCreatingTeacher }] = useMutation<
    CreateTeacherResponse,
    CreateTeacherPayload
  >(CREATE_TEACHER_MUTATION, {
    refetchQueries: [
      { query: TEACHERS_QUERY, variables: { limit: 10, offset: 0 } },
      {
        query: TOTAL_TEACHERS_QUERY,
      },
    ],
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

  //SELECTED SCHOOL ID
  const selectedSchool = useWatch({
    control: control,
    name: "schoolId",
  });

  //LIST ALL GRADES BY SCHOOL QUERY
  const { data: schoolData, loading: isLoading } = useQuery<
    GradesBySchoolQueryResponse,
    { schoolId: string }
  >(GRADES_BY_SCHOOL_QUERY, {
    variables: { schoolId: selectedSchool },
    skip: !selectedSchool,
  });

  const addedGrades = useWatch({ control, name: "grades" }) || [];
  const schoolGrades = schoolData?.school?.grades || [];

  const handleCreateTeacher = async (data: CreateTeacherSchemaType) => {
    try {
      const rest = omitKeys(data, ["grades", "schoolId"]);

      const schoolSectionIds = data?.grades?.flatMap((grade) =>
        grade.sections.map((section) => section.id),
      );

      const response = await createTeacher({
        variables: {
          schoolId: data.schoolId,
          input: { ...rest, schoolSectionIds },
        },
      });

      addToast({
        title: response?.data?.createTeacher?.message,
        color: "success",
      });
      handleCancel();
    } catch (error) {
      const errMsg = handleApolloError(error);

      addToast({ title: errMsg, color: "danger" });
    }
  };

  //FORM CANCEL HANDLER
  const handleCancel = () => {
    reset();
    navigate("..");
  };

  const handleAddGradeAndSections = (
    data: CreateTeacherSchemaType["grades"][0],
  ) => {
    setValue("grades", [...addedGrades, data], { shouldValidate: true });
  };

  const handleDeleteGrade = (id: string) => {
    const newGrades = addedGrades?.filter((g) => g.id !== id);

    setValue("grades", newGrades, { shouldValidate: true });
  };

  return (
    <PageWrapper
      slots={{
        title: "Add Teacher",
        breadcrumb: <BreadcrumbNav items={[{ label: "Teachers", to: ".." }]} />,
      }}
    >
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

          <Controller
            control={control}
            name="schoolId"
            render={({ field, fieldState: { invalid, error } }) => (
              <Autocomplete
                isRequired
                errorMessage={error?.message}
                inputProps={{
                  classNames: {
                    inputWrapper: "border-small shadow-none",
                  },
                }}
                isDisabled={isLoadingSchools}
                isInvalid={invalid}
                items={schools}
                label="School"
                labelPlacement="outside-top"
                name={field.name}
                selectedKey={field.value}
                variant="bordered"
                onBlur={field.onBlur}
                onSelectionChange={(e) => field.onChange(e)}
              >
                {(school) => (
                  <AutocompleteItem key={school.id} textValue={school.name}>
                    {school.name}
                  </AutocompleteItem>
                )}
              </Autocomplete>
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
            disabled={isCreatingTeacher}
            type="reset"
            variant="flat"
            onPress={handleCancel}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            isLoading={isCreatingTeacher}
            onPress={() => {
              void handleSubmit(handleCreateTeacher)();
            }}
          >
            Save
          </Button>
        </div>
      </FormWrapper>
    </PageWrapper>
  );
}
