import { useMutation, useQuery } from "@apollo/client";
import { Checkbox, CheckboxGroup } from "@heroui/checkbox";
import { Form } from "@heroui/form";
import { SelectItem } from "@heroui/select";
import { Skeleton } from "@heroui/skeleton";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { twMerge } from "tailwind-merge";

import {
  CreateGradeSchema,
  type CreateGradeSchemaType,
} from "../schemas/createGradeSchema";
import { UPDATE_GRADE_MUTATION } from "../services/gradeMutations";

import { FormSkeleton, FormWrapper, PageWrapper } from "@/components";
import { BreadcrumbNav, Button, Select } from "@/components/ui";
import { handleApolloError } from "@/core/errors";
import { GRADES_BY_SCHOOL_QUERY } from "@/features/school/services/queries";
import Section from "../components/Section";
import { GRADES_AND_SECTIONS_QUERY } from "../services/gradeQueries";
import type {
  GradesSectionsAndSchoolQueryInput,
  GradesSectionsAndSchoolQueryResponse,
  UpdateSchoolGradeResponse,
} from "../services/types";

export default function UpdateGradePage() {
  const { schoolId, schoolGradeId } = useParams();
  const navigate = useNavigate();

  //CREATE SCHOOL MUTATION
  const [createSchoolGrade, { loading: isCreatingSchoolGrade }] = useMutation<
    UpdateSchoolGradeResponse,
    {
      schoolGradeId: string;
      input: { gradeId: number; sectionIds: number[] };
    }
  >(UPDATE_GRADE_MUTATION, {
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
      gradeId: "1",
      sectionIds: [],
    },
    mode: "onChange",
  });

  //GRADES AND SECTIONS
  const grades = data?.grades ?? [];
  const sections = data?.sections ?? [];

  //SELECTING ALREADY CREATED GRADE
  const createdGrades = data?.school?.grades ?? [];

  const disabledGrades = data?.school?.grades?.filter(
    (grade) => grade.id !== schoolGradeId,
  );

  //SELECTED SECTION IDS
  const sectionIds = useWatch({ control, name: "sectionIds" }) || [];

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
          schoolGradeId: schoolGradeId!,
          input: { ...data, gradeId: Number(data.gradeId) },
        },
      });

      addToast({
        title: response?.data?.updateSchoolGrade?.message,
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

  React.useEffect(() => {
    if (createdGrades.length > 0) {
      const currentGrade = createdGrades?.find(
        (grade) => grade.id === schoolGradeId,
      );

      const currentSectionIds = currentGrade?.sections?.map(
        (s) => s.section.id,
      );

      reset({
        gradeId: currentGrade?.grade.id.toString(),
        sectionIds: currentSectionIds,
      });
    }
  }, [createdGrades, reset, schoolGradeId]);

  return (
    <PageWrapper
      slots={{
        breadcrumb: (
          <BreadcrumbNav
            items={[
              { label: "Schools", to: "../../.." },
              { label: data?.school?.name, isLoading, to: ".." },
              { label: "Update Grade/Year & Sections" },
            ]}
          />
        ),
        title: "Update Grade/Year & Sections",
      }}
    >
      <FormWrapper>
        {isLoading ? (
          <FormSkeleton />
        ) : (
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
                  disabledKeys={disabledGrades?.map((grade) =>
                    grade.grade.id.toString(),
                  )}
                  errorMessage={error?.message}
                  isInvalid={invalid}
                  isLoading={isLoading}
                  label="Grade/Year"
                  labelPlacement="outside"
                  placeholder="Select"
                  selectedKeys={[field.value]}
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

              {isLoading ? (
                <>
                  <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(2.5rem,1fr))] gap-2">
                    {Array.from({ length: 26 }).map((_, i) => (
                      <Skeleton key={i} className="w-10 rounded-lg">
                        <div className="bg-default-200 h-10 w-10 rounded-lg" />
                      </Skeleton>
                    ))}
                  </div>
                </>
              ) : (
                <>
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
                  <CheckboxGroup
                    onValueChange={(values) =>
                      setValue("sectionIds", values.map(Number), {
                        shouldValidate: true,
                      })
                    }
                    value={sectionIds.map(String)}
                  >
                    <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(2.5rem,1fr))] gap-2">
                      {sections?.map((section, i) => {
                        return (
                          <Section
                            value={section.id.toString()}
                            key={section.id}
                            delay={i * 0.07}
                            isInvalid={!!errors?.sectionIds}
                          >
                            {section?.section}
                          </Section>
                        );
                      })}
                    </div>
                  </CheckboxGroup>
                </>
              )}
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
        )}
      </FormWrapper>
    </PageWrapper>
  );
}
