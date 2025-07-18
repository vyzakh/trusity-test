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
import type { GradesBySchoolQueryResponse } from "@/features/school/services/types";
import {
  STUDENTS_QUERY,
  TOTAL_STUDENTS_QUERY,
} from "@/features/students/services/studentQueries";
import { useMutation } from "@apollo/client";
import { AutocompleteItem } from "@heroui/autocomplete";
import { Form } from "@heroui/form";
import { SelectItem } from "@heroui/select";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseDate } from "@internationalized/date";
import { DateTime } from "luxon";
import React from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import {
  CreateB2BStudentSchema,
  type CreateB2BStudentSchemaType,
} from "../schemas/createB2BStudentSchema";
import { CREATE_B2B_STUDENT_MUTATION } from "../services/studentMutations";
import type { CreateB2BStudentResponse } from "../services/types";
import GuardianDetails from "./GuardianDetails";

type CreateStudentInput = Omit<
  CreateB2BStudentSchemaType,
  "sectionId" | "gradeId"
> & {
  schoolSectionId: string;
};

type CreateStudentFormProps = {
  isLoading?: boolean;
  school?: GradesBySchoolQueryResponse["school"];
};

export default function CreateStudentForm({
  school,
  isLoading,
}: CreateStudentFormProps) {
  const { schoolId } = useParams();

  const navigate = useNavigate();
  const [sections, setSections] = React.useState<
    { id: string; section: string }[]
  >([]);

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
        variables: { limit: 10, offset: 0, schoolId },
      },
      {
        query: TOTAL_STUDENTS_QUERY,
        variables: { schoolId },
      },
    ],
  });

  //RHF CONFIG
  const methods = useForm<CreateB2BStudentSchemaType>({
    resolver: zodResolver(CreateB2BStudentSchema),
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

  const selectedGrade = useWatch({ control: methods.control, name: "gradeId" });
  const grades = school?.grades || [];

  // STUDENT CREATE HANDLER
  const handleCreateStudent = async (data: CreateB2BStudentSchemaType) => {
    const rest = omitKeys(data, ["gradeId", "sectionId"]);

    try {
      const schoolGradeSectionId = school?.grades
        ?.find((g) => g.id === data.gradeId)
        ?.sections?.find((s) => s.id === data.sectionId)?.id;

      const response = await createStudent({
        variables: {
          schoolId: schoolId!,
          accountType: "B2B",
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

    const selected = school?.grades?.find((g) => g.id === selectedGrade);

    setSections(
      selected?.sections.map((s) => ({
        id: s.id,
        section: s.section.section,
      })) || [],
    );
  }, [selectedGrade, school]);

  return (
    <FormProvider {...methods}>
      <Form
        className="flex flex-col gap-5 px-5"
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
                <AutocompleteItem key={section.id} textValue={section.section}>
                  {section.section}
                </AutocompleteItem>
              )}
            </Autocomplete>
          )}
        />

        <div className="flex w-full items-center justify-end gap-2">
          <Button
            color="default"
            disabled={isCreating}
            type="reset"
            variant="flat"
            onPress={handleCancel}
          >
            Cancel
          </Button>
          <Button color="primary" isLoading={isCreating} type="submit">
            Save
          </Button>
        </div>
      </Form>
    </FormProvider>
  );
}
