import { useMutation, useQuery } from "@apollo/client";
import { Checkbox } from "@heroui/checkbox";
import { Form } from "@heroui/form";
import { SelectItem } from "@heroui/select";
import { Skeleton } from "@heroui/skeleton";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { twMerge } from "tailwind-merge";

import { Sections } from "../components";
import {
  CreateGradeSchema,
  type CreateGradeSchemaType,
} from "../schemas/createGradeSchema";
import { CREATE_GRADE_MUTATION } from "../services/gradeMutations";

import { FormWrapper, PageWrapper } from "@/components";
import { title } from "@/components/primitives";
import { BreadcrumbNav, Button, Select } from "@/components/ui";
import { handleApolloError } from "@/core/errors";
import { GRADES_BY_SCHOOL_QUERY } from "@/features/school/services/queries";
import { GRADES_AND_SECTIONS_QUERY } from "../services/gradeQueries";
import type {
  CreateSchoolGradeResponse,
  GradesSectionsAndSchoolQueryInput,
  GradesSectionsAndSchoolQueryResponse,
} from "../services/types";

export default function CreateGradePage() {
  const { schoolId } = useParams();
  const navigate = useNavigate();

  //CREATE SCHOOL MUTATION
  const [createSchoolGrade, { loading: isCreatingSchoolGrade }] = useMutation<
    CreateSchoolGradeResponse,
    {
      schoolId: string;
      input: { gradeId: number; sectionIds: number[] };
    }
  >(CREATE_GRADE_MUTATION, {
    refetchQueries: [
      {
        query: GRADES_BY_SCHOOL_QUERY,
        variables: { schoolId },
      },
    ],
  });

  // GET GRADES, SECTIONS AND SCHOOL QUERY
  const { data, loading: isLoading } = useQuery<
    GradesSectionsAndSchoolQueryResponse,
    GradesSectionsAndSchoolQueryInput
  >(GRADES_AND_SECTIONS_QUERY, {
    variables: { schoolId: schoolId!, includeSchool: true },
    skip: !schoolId,
  });

  //RHF CONFIQURATION
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateGradeSchemaType>({
    resolver: zodResolver(CreateGradeSchema),
    defaultValues: {
      gradeId: "",
      sectionIds: [],
    },
    mode: "onChange",
  });

  //GRADES
  const grades = data?.grades ?? [];
  const sections = data?.sections ?? [];

  //SELECTING ALREADY CREATED GRADE
  const createdGrades = data?.school?.grades ?? [];

  //SELECTED SECTION IDS
  const sectionIds = useWatch({ control, name: "sectionIds" }) || [];

  //SECTION CHANGE HANDLER
  const handleSectionChange = (value: number) => {
    const currentSectionIds = sectionIds || [];
    const newSectionIds = sectionIds.includes(value)
      ? currentSectionIds.filter((sectionId) => sectionId !== value)
      : [...currentSectionIds, value];

    setValue("sectionIds", newSectionIds, { shouldValidate: true });
  };

  //SELECT ALL SECTIONS HANDLER
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const allSectionIds = data?.sections?.map((section) => section.id) || [];

    setValue("sectionIds", e.target.checked ? allSectionIds : [], {
      shouldValidate: true,
    });
  };

  //CREATE GRADE HANDLER
  const handleCreateSchoolGrade = async (data: CreateGradeSchemaType) => {
    try {
      const response = await createSchoolGrade({
        variables: {
          schoolId: schoolId!,
          input: { ...data, gradeId: Number(data.gradeId) },
        },
      });

      addToast({
        title: response?.data?.createSchoolGrade?.message,
        color: "success",
      });
      handleCancel();
    } catch (error) {
      const errMessage = handleApolloError(error);

      addToast({ title: errMessage, color: "danger" });
    }
  };

  //FORM CANCEL HANDLER
  const handleCancel = () => {
    reset();
    navigate("..");
  };

  return (
    <PageWrapper>
      <BreadcrumbNav
        items={[
          { label: "Schools", to: "../../.." },
          { label: data?.school?.name, isLoading, to: ".." },
          { label: "Update Grade/Year & Sections" },
        ]}
      />
      <h1 className={title({ size: "lg" })}>Add Grade/Year & Sections</h1>
      <FormWrapper>
        <Form
          className="flex flex-col gap-5 px-5"
          validationBehavior="aria"
          onSubmit={handleSubmit(handleCreateSchoolGrade)}
        >
          <Controller
            control={control}
            name="gradeId"
            render={({ field, fieldState: { invalid, error } }) => (
              <Select
                {...field}
                isRequired
                disabledKeys={createdGrades?.map((grade) =>
                  grade.grade.id.toString(),
                )}
                errorMessage={error?.message}
                isInvalid={invalid}
                isLoading={isLoading}
                label="Grade/Year"
                labelPlacement="outside"
                placeholder="Select"
                variant="bordered"
              >
                {grades?.map((grade) => (
                  <SelectItem key={grade.id} textValue={grade.grade}>
                    {grade.grade}
                  </SelectItem>
                ))}
              </Select>
            )}
          />

          <div className="flex w-full flex-col gap-3">
            <p
              className={twMerge(
                "required ms-0.5 text-sm",
                errors?.sectionIds?.message && "text-danger",
              )}
            >
              Section
            </p>
            <Checkbox
              className="mb-0.5"
              classNames={{ label: "text-sm" }}
              isSelected={
                sectionIds?.length !== 0 &&
                sectionIds?.length === data?.sections?.length
              }
              onChange={handleSelectAll}
            >
              Select All
            </Checkbox>

            <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(2.5rem,1fr))] gap-2">
              {isLoading
                ? Array.from({ length: 26 }).map((_, i) => (
                    <Skeleton key={i} className="w-10 rounded-lg">
                      <div className="bg-default-200 h-10 w-10 rounded-lg" />
                    </Skeleton>
                  ))
                : sections?.map((section, i) => {
                    const selected = sectionIds.includes(section.id);

                    return (
                      <Sections
                        key={section.id}
                        delay={i * 0.07}
                        handleChangeSection={handleSectionChange}
                        section={section}
                        selected={selected}
                      />
                    );
                  })}
            </div>
            {errors?.sectionIds && errors?.sectionIds?.message && (
              <small className="text-tiny text-danger">
                {errors?.sectionIds?.message}
              </small>
            )}
          </div>
          <div className="mt-5 flex w-full items-center justify-end gap-2">
            <Button
              color="default"
              disabled={isCreatingSchoolGrade}
              variant="flat"
              onPress={handleCancel}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              isLoading={isCreatingSchoolGrade}
              type="submit"
            >
              Save
            </Button>
          </div>
        </Form>
      </FormWrapper>
    </PageWrapper>
  );
}
