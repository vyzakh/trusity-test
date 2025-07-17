import { useApolloClient, useMutation, useQuery } from "@apollo/client";
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

import { GuardianDetails } from "../components";
import {
  CreateB2BStudentSchema,
  type CreateB2BStudentSchemaType,
} from "../schemas/createB2BStudentSchema";
import { CREATE_B2B_STUDENT_MUTATION } from "../services/studentMutations";

import { FormWrapper, PageWrapper } from "@/components";
import { title } from "@/components/primitives";
import {
  Autocomplete,
  BreadcrumbNav,
  Button,
  DatePicker,
  Input,
  PhoneInput,
  Select,
} from "@/components/ui";
import { handleApolloError } from "@/core/errors";
import type { BusinessType } from "@/core/services/types";
import { omitKeys } from "@/core/utils/object";
import { GRADES_BY_SCHOOL_QUERY } from "@/features/school/services/queries";
import type { GradesBySchoolQueryResponse } from "@/features/school/services/types";
import type { CreateB2BStudentResponse } from "../services/types";

type CreateStudentInput = Omit<
  CreateB2BStudentSchemaType,
  "sectionId" | "gradeId"
> & {
  schoolSectionId: string;
};

export default function CreateStudentPage() {
  const { schoolId } = useParams();
  const client = useApolloClient();
  const navigate = useNavigate();
  const [sections, setSections] = React.useState<
    { id: string; section: string }[]
  >([]);

  //LIST ALL GRADES BY SCHOOL QUERY
  const { data: schoolData, loading: isLoadingSchoolData } = useQuery<
    GradesBySchoolQueryResponse,
    { schoolId: string }
  >(GRADES_BY_SCHOOL_QUERY, {
    variables: { schoolId: schoolId! },
    skip: !schoolId,
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
    onCompleted: () => {
      client.cache.evict({ fieldName: "students" });
      client.cache.evict({ fieldName: "totalStudents" });
      client.cache.gc();
    },
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
  const grades = schoolData?.school?.grades || [];

  // STUDENT CREATE HANDLER
  const handleCreateStudent = async (data: CreateB2BStudentSchemaType) => {
    const rest = omitKeys(data, ["gradeId", "sectionId"]);

    try {
      const schoolGradeSectionId = schoolData?.school?.grades
        ?.find((g) => g.id === data.gradeId)
        ?.sections?.find((s) => s.id === data.sectionId)?.id;

      console.log(schoolGradeSectionId);

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

  React.useEffect(() => {
    if (isLoadingSchoolData || !selectedGrade) return;

    const selected = schoolData?.school?.grades?.find(
      (g) => g.id === selectedGrade,
    );

    setSections(
      selected?.sections.map((s) => ({
        id: s.id,
        section: s.section.section,
      })) || [],
    );
  }, [selectedGrade, isLoadingSchoolData, schoolData]);

  return (
    <PageWrapper>
      <BreadcrumbNav
        items={[
          { label: "Schools", to: "../../.." },
          {
            label: schoolData?.school?.name,
            isLoading: isLoadingSchoolData,
            to: "..",
          },
          { label: "Add Student" },
        ]}
      />

      <h1 className={title({ size: "lg" })}>Add Student</h1>
      <FormWrapper>
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
                  isLoading={isLoadingSchoolData}
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
      </FormWrapper>
    </PageWrapper>
  );
}
