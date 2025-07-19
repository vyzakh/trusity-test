import { Autocomplete, Select } from "@/components/ui";
import type { BusinessType } from "@/core/services/types";
import { SCHOOL_NAMES_QUERY } from "@/features/school/pages/schools/services/schoolQueries";
import type { SchoolNamesQueryResponse } from "@/features/school/pages/schools/services/types";
import type { GradesBySchoolQueryResponse } from "@/features/school/services/types";
import { useQuery } from "@apollo/client";
import { AutocompleteItem } from "@heroui/autocomplete";
import { SelectItem } from "@heroui/select";
import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import type { CreateB2BStudentSchemaType } from "../schemas/studentSchema";

type SchoolInfoProps = {
  schoolData?: GradesBySchoolQueryResponse["school"];
  isLoading: boolean;
};

export default function SchoolInfo({ schoolData, isLoading }: SchoolInfoProps) {
  const { control } = useFormContext<CreateB2BStudentSchemaType>();
  const [sections, setSections] = React.useState<
    { id: string; section: string }[]
  >([]);

  //LIST ALL B2B SCHOOLS QUERY
  const { data: b2bSchools, loading: isLoadingSchools } = useQuery<
    SchoolNamesQueryResponse,
    { accountType: BusinessType }
  >(SCHOOL_NAMES_QUERY, {
    variables: { accountType: "B2B" },
  });

  //ALL SCHOOLS AND GRADES
  const schools = b2bSchools?.schools || [];
  const grades = schoolData?.grades || [];

  //SELECTED SCHOOL ID
  const selectedSchool = useWatch({
    control: control,
    name: "schoolId",
  });

  const selectedGrade = useWatch({ control: control, name: "gradeId" });

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
      {" "}
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
            isDisabled={!selectedSchool}
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
