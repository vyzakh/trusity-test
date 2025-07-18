import { AutocompleteItem } from "@heroui/autocomplete";
import { Form } from "@heroui/form";
import { SelectItem } from "@heroui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";

import {
  CreateStudentSchema,
  type CreateStudentSchemaType,
} from "../../schemas/createStudentSchema";

import {
  Autocomplete,
  Button,
  DatePicker,
  Input,
  PhoneInput,
  Select,
} from "@/components/ui";
import { handleApolloError } from "@/core/errors";
import type { BusinessType } from "@/core/services/types";
import { omitKeys } from "@/core/utils/object";
import { SCHOOLS_QUERY } from "@/features/school/pages/schools/services/schoolQueries";
import type { SchoolsQueryResponse } from "@/features/school/pages/schools/services/types";
import { GuardianDetails } from "@/features/school/pages/students/components";
import type { CreateB2BStudentSchemaType } from "@/features/school/pages/students/schemas/createB2BStudentSchema";
import { CREATE_B2B_STUDENT_MUTATION } from "@/features/school/pages/students/services/studentMutations";
import type { CreateB2BStudentResponse } from "@/features/school/pages/students/services/types";
import { GRADES_BY_SCHOOL_QUERY } from "@/features/school/services/queries";
import type { GradesBySchoolQueryResponse } from "@/features/school/services/types";
import { useMutation, useQuery } from "@apollo/client";
import { addToast } from "@heroui/toast";
import { parseDate } from "@internationalized/date";
import { DateTime } from "luxon";
import { useNavigate } from "react-router";
import {
  STUDENTS_QUERY,
  TOTAL_STUDENTS_QUERY,
} from "../../services/studentQueries";

type CreateStudentInput = Omit<
  CreateB2BStudentSchemaType,
  "sectionId" | "gradeId"
> & {
  schoolSectionId: string;
};

export default function B2BStudentForm() {
  const navigate = useNavigate();
  const [sections, setSections] = React.useState<
    { id: string; section: string }[]
  >([]);

  //LIST ALL B2B SCHOOLS QUERY
  const { data: b2bSchools, loading: isLoadingSchools } = useQuery<
    SchoolsQueryResponse,
    { accountType: BusinessType }
  >(SCHOOLS_QUERY, {
    variables: { accountType: "B2B" },
  });

  //CREATE B2B STUDENT MUTATION
  const [createStudent, { loading: isCreating }] = useMutation<
    CreateB2BStudentResponse,
    {
      schoolId: string;
      accountType: BusinessType;
      input: CreateStudentInput;
    }
  >(CREATE_B2B_STUDENT_MUTATION, {
    refetchQueries: [
      {
        query: STUDENTS_QUERY,
        variables: { limit: 10, offset: 0 },
      },
      {
        query: TOTAL_STUDENTS_QUERY,
      },
    ],
  });

  //RHF CONFIG
  const methods = useForm<CreateStudentSchemaType>({
    resolver: zodResolver(CreateStudentSchema),
    defaultValues: {
      name: "",
      email: "",
      gradeId: "",
      contactNumber: "",
      dateOfBirth: "",
      sectionId: "",
      guardian: {
        name: "",
        email: "",
        contactNumber: "",
      },
    },
  });

  //SELECTED SCHOOL ID
  const selectedSchool = useWatch({
    control: methods.control,
    name: "schoolId",
  });

  //SELECTED GRADE ID
  const selectedGrade = useWatch({ control: methods.control, name: "gradeId" });

  //LIST ALL GRADES BY SCHOOL QUERY
  const { data: schoolData, loading: isLoadingSchoolData } = useQuery<
    GradesBySchoolQueryResponse,
    { schoolId: string }
  >(GRADES_BY_SCHOOL_QUERY, {
    variables: { schoolId: selectedSchool },
    skip: !selectedSchool,
  });

  //ALL SCHOOLS AND GRADES
  const schools = b2bSchools?.schools || [];
  const grades = schoolData?.school?.grades || [];

  // STUDENT CREATE HANDLER
  const handleCreateStudent = async (data: CreateStudentSchemaType) => {
    const rest = omitKeys(data, ["gradeId", "sectionId", "schoolId"]);

    try {
      const schoolGradeSectionId = schoolData?.school?.grades
        ?.find((g) => g.id === data.gradeId)
        ?.sections?.find((s) => s.id === data.sectionId)?.id;

      const response = await createStudent({
        variables: {
          accountType: "B2B",
          schoolId: data.schoolId,
          input: {
            ...rest,
            schoolSectionId: schoolGradeSectionId!,
          },
        },
      });

      addToast({
        title: response?.data?.createStudent?.message,
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
    methods.reset();
    navigate("..");
  };

  //SET SECTIONS BASED ON SELECTED GRADE
  React.useEffect(() => {
    if (!selectedGrade) return;

    const selected = schoolData?.school?.grades?.find(
      (g) => g.id === selectedGrade,
    );

    setSections(
      selected?.sections.map((s) => ({
        id: s.id,
        section: s.section.section,
      })) || [],
    );
  }, [selectedGrade, schoolData]);

  return (
    <React.Fragment>
      <FormProvider {...methods}>
        <Form
          className="flex flex-col gap-5"
          validationBehavior="aria"
          onSubmit={methods.handleSubmit(handleCreateStudent)}
        >
          <Controller
            control={methods.control}
            name="name"
            render={({ field, fieldState: { error, invalid } }) => (
              <Input
                {...field}
                isRequired
                errorMessage={error?.message}
                isInvalid={invalid}
                label="Name"
                labelPlacement="outside"
                placeholder="Student name"
                variant="bordered"
              />
            )}
          />
          <Controller
            control={methods.control}
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
            control={methods.control}
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
            control={methods.control}
            name="dateOfBirth"
            render={({ field, fieldState: { invalid, error } }) => (
              <DatePicker
                {...field}
                isRequired
                showMonthAndYearPickers
                classNames={{ inputWrapper: "shadow-none border-1" }}
                errorMessage={error?.message}
                isInvalid={invalid}
                label="Date of Birth"
                labelPlacement="outside"
                value={field?.value !== "" ? parseDate(field.value) : null}
                variant="bordered"
                onChange={(val) => {
                  if (val) {
                    const formatted = DateTime.fromObject({
                      year: val.year,
                      month: val.month,
                      day: val.day,
                    }).toFormat("yyyy-MM-dd");

                    field.onChange(formatted);
                  } else {
                    field.onChange(null);
                  }
                }}
              />
            )}
          />

          {/* GUARDIANS DETAILS */}
          <GuardianDetails />

          <Controller
            control={methods.control}
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
            control={methods.control}
            name="gradeId"
            render={({ field, fieldState: { invalid, error } }) => (
              <Select
                {...field}
                isRequired
                errorMessage={error?.message}
                isInvalid={invalid}
                isLoading={isLoadingSchoolData}
                isDisabled={!selectedSchool}
                label="Grade/Year"
                labelPlacement="outside"
                placeholder="Select"
                variant="bordered"
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
            control={methods.control}
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
                  <AutocompleteItem
                    key={section.id}
                    textValue={section.section}
                  >
                    {section.section}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            )}
          />
          <div className="flex w-full items-center justify-end gap-2">
            <Button
              className="h-9"
              color="default"
              disabled={isCreating}
              type="reset"
              variant="flat"
              onPress={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className="h-9"
              color="primary"
              isLoading={isCreating}
              type="submit"
            >
              Save
            </Button>
          </div>
        </Form>
      </FormProvider>
    </React.Fragment>
  );
}
