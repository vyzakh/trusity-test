import { Form } from "@heroui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";

import {
  CreateB2BStudentSchema,
  type CreateB2BStudentSchemaType,
} from "../../schemas/studentSchema";

import { Button, DatePicker, Input, PhoneInput } from "@/components/ui";
import { handleApolloError } from "@/core/errors";
import type { BusinessType } from "@/core/services/types";
import { omitKeys } from "@/core/utils/object";
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
import GuardianDetails from "../GuardianDetails";
import SchoolInfo from "../SchoolInfo";

type CreateStudentInput = Omit<
  CreateB2BStudentSchemaType,
  "sectionId" | "gradeId" | "schoolId"
> & {
  schoolSectionId: string;
};

export default function B2BStudentForm() {
  const navigate = useNavigate();

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
  const methods = useForm<CreateB2BStudentSchemaType>({
    resolver: zodResolver(CreateB2BStudentSchema),
    defaultValues: {
      name: "",
      email: "",
      contactNumber: "",
      dateOfBirth: "",
      schoolId: "",
      gradeId: "",
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

  //LIST ALL GRADES BY SCHOOL QUERY
  const { data: schoolData, loading: isLoadingSchoolData } = useQuery<
    GradesBySchoolQueryResponse,
    { schoolId: string }
  >(GRADES_BY_SCHOOL_QUERY, {
    variables: { schoolId: selectedSchool },
    skip: !selectedSchool,
  });

  // STUDENT CREATE HANDLER
  const handleCreateStudent = async (data: CreateB2BStudentSchemaType) => {
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

          <SchoolInfo
            schoolData={schoolData?.school}
            isLoading={isLoadingSchoolData}
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
