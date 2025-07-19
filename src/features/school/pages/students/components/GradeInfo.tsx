import { Autocomplete, Select } from "@/components/ui";
import type { GradesBySchoolQueryResponse } from "@/features/school/services/types";
import { AutocompleteItem } from "@heroui/autocomplete";
import { SelectItem } from "@heroui/select";
import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import type { CreateB2BStudentSchemaType } from "../schemas/createB2BStudentSchema";

type GradeInfoProps = {
  schoolData?: GradesBySchoolQueryResponse["school"];
  isLoading: boolean;
};

export default function GradeInfo({ isLoading, schoolData }: GradeInfoProps) {
  const { control } = useFormContext<CreateB2BStudentSchemaType>();
  const [sections, setSections] = React.useState<
    { id: string; section: string }[]
  >([]);

  const selectedGrade = useWatch({ control: control, name: "gradeId" });
  const grades = schoolData?.grades || [];

  //SET SECTIONS BASED ON SELECTED GRADE
  React.useEffect(() => {
    if (!selectedGrade) return;

    const selected = schoolData?.grades?.find((g) => g.id === selectedGrade);

    setSections(
      selected?.sections.map((s) => ({
        id: s.id,
        section: s.section.section,
      })) || [],
    );
  }, [selectedGrade, schoolData]);

  return (
    <React.Fragment>
      <Controller
        control={control}
        name="gradeId"
        render={({ field, fieldState: { invalid, error } }) => (
          <Select
            {...field}
            isRequired
            errorMessage={error?.message}
            isInvalid={invalid}
            isLoading={isLoading}
            label="Grade/Year"
            labelPlacement="outside"
            placeholder="Select"
            variant="bordered"
            selectedKeys={[field.value]}
          >
            {grades?.map((grade) => (
              <SelectItem key={grade.id} textValue={grade.grade.grade}>
                {grade.grade.grade}
              </SelectItem>
            ))}
          </Select>
        )}
      />

      <Controller
        control={control}
        name="sectionId"
        render={({ field, fieldState: { invalid, error } }) => (
          <Autocomplete
            isRequired
            errorMessage={error?.message}
            inputProps={{
              classNames: {
                inputWrapper: "border-small shadow-none",
              },
            }}
            isDisabled={!selectedGrade}
            isInvalid={invalid}
            items={sections}
            label="Section"
            labelPlacement="outside"
            name={field.name}
            placeholder="Select"
            selectedKey={field.value}
            variant="bordered"
            onBlur={field.onBlur}
            onSelectionChange={(e) => field.onChange(e)}
          >
            {(section) => (
              <AutocompleteItem key={section.id} textValue={section.section}>
                {section.section}
              </AutocompleteItem>
            )}
          </Autocomplete>
        )}
      />
    </React.Fragment>
  );
}
