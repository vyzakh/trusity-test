import { Card } from "@heroui/card";
import { Checkbox } from "@heroui/checkbox";
import { Form } from "@heroui/form";
import { SelectItem } from "@heroui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import {
  CreateGradeSchema,
  type CreateGradeSchemaType,
} from "../schemas/gradeAndSectionsSchema";

import Sections from "./Sections";

import { Button, Select } from "@/components/ui";
import type { SchoolGradeWithSections } from "@/features/school/services/types";
import type { CreateTeacherSchemaType } from "../schemas/createTeacherSchema";

type GradeAndSectionProps = {
  handleAddGradeAndSections: (
    data: CreateTeacherSchemaType["grades"][0],
  ) => void;
  schoolGrades: SchoolGradeWithSections[] | [];
  isLoading: boolean;
  addedGrades: CreateTeacherSchemaType["grades"];
  isInvalid: boolean;
};

export default function GradeAndSection({
  handleAddGradeAndSections,
  schoolGrades,
  isLoading,
  addedGrades,
  isInvalid,
}: GradeAndSectionProps) {
  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    reset,
  } = useForm<CreateGradeSchemaType>({
    resolver: zodResolver(CreateGradeSchema),
    defaultValues: {
      gradeId: "",
      sectionIds: [],
    },
    mode: "onChange",
  });

  //SELECTED SECTION IDS
  const sectionIds = useWatch({ control, name: "sectionIds" }) || [];

  //SECTION CHANGE HANDLER
  const handleSectionChange = (value: string) => {
    const currentSectionIds = sectionIds || [];
    const newSectionIds = sectionIds.includes(value)
      ? currentSectionIds.filter((sectionId) => sectionId !== value)
      : [...currentSectionIds, value];

    setValue("sectionIds", newSectionIds, { shouldValidate: true });
  };

  const handleAddGrade = (data: CreateGradeSchemaType) => {
    const selectedGrade = schoolGrades?.find(
      (grade) => grade.grade.id === Number(data.gradeId),
    );
    const sections = selectedGrade?.sections
      ?.filter((s) => data?.sectionIds?.includes(s.id))
      ?.map((s) => ({ id: s.id, section: s.section.section }));

    if (selectedGrade && sections) {
      handleAddGradeAndSections({
        id: selectedGrade?.grade?.id?.toString(),
        grade: selectedGrade?.grade?.grade,
        sections,
      });
    }
    reset({ gradeId: "", sectionIds: [] });
  };

  const selectedGrade = useWatch({ control: control, name: "gradeId" });

  const sections = selectedGrade
    ? schoolGrades
        ?.find((g) => g.grade.id === Number(selectedGrade))
        ?.sections?.map((section) => ({
          ...section.section,
          id: section.id,
        })) || []
    : [];

  //SELECT ALL SECTIONS HANDLER
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const allSectionIds = sections?.map((section) => section.id) || [];

    setValue("sectionIds", e.target.checked ? allSectionIds : [], {
      shouldValidate: true,
    });
  };

  return (
    <Card
      className={twMerge(
        "flex w-full flex-col gap-5 bg-[#F8F8F8] p-5 shadow-none",
        isInvalid && "border-danger border-1 border-dashed",
      )}
    >
      <Form
        className="flex flex-col gap-5"
        validationBehavior="aria"
        onSubmit={handleSubmit(handleAddGrade)}
      >
        <h5 className="text-md font-bold">Grade/Year & Sections</h5>
        <Controller
          control={control}
          name="gradeId"
          render={({ field, fieldState: { invalid, error } }) => (
            <Select
              {...field}
              isRequired
              disabledKeys={addedGrades?.map((grade) => grade.id)}
              errorMessage={error?.message}
              isInvalid={invalid}
              isLoading={isLoading}
              label="Grade/Year"
              labelPlacement="outside"
              placeholder="Select"
              selectedKeys={[field.value]}
              variant="bordered"
            >
              {schoolGrades?.map((grade) => (
                <SelectItem key={grade.grade.id} textValue={grade.grade.grade}>
                  {grade.grade.grade}
                </SelectItem>
              ))}
            </Select>
          )}
        />

        {sections?.length > 0 && (
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
                sectionIds?.length === sections?.length
              }
              onChange={handleSelectAll}
            >
              Select All
            </Checkbox>

            <div className="grid w-full grid-cols-[repeat(auto-fit,2.5rem)] gap-2">
              {sections?.map((section, i) => {
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
        )}
        <Button
          color="default"
          // disabled={isCreatingSchoolGrade}
          type="submit"
          // onPress={handleCancel}
        >
          Add
        </Button>
      </Form>
    </Card>
  );
}
