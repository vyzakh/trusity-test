import { useQuery } from "@apollo/client";
import { useParams } from "react-router";

import { FormWrapper, PageWrapper } from "@/components";
import {
  BreadcrumbNav,
  Button,
  DatePicker,
  Input,
  PhoneInput,
} from "@/components/ui";
import { handleApolloError } from "@/core/errors";
import type { BusinessType } from "@/core/services/types";
import { omitKeys } from "@/core/utils/object";
import { GRADES_BY_SCHOOL_QUERY } from "@/features/school/services/queries";
import type { GradesBySchoolQueryResponse } from "@/features/school/services/types";
import { GuardianDetails } from "@/features/students/components";
import { CREATE_B2B_STUDENT_MUTATION } from "@/features/students/services/studentMutation";
import {
  STUDENTS_QUERY,
  TOTAL_STUDENTS_QUERY,
} from "@/features/students/services/studentQueries";
import type { CreateB2BStudentResponse } from "@/features/students/services/types";
import { useMutation } from "@apollo/client";
import { Form } from "@heroui/form";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseDate } from "@internationalized/date";
import { DateTime } from "luxon";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { GradeInfo } from "../components";
import {
  CreateB2BStudentSchema,
  type CreateB2BStudentSchemaType,
} from "../schemas/createB2BStudentSchema";

type CreateStudentInput = Omit<
  CreateB2BStudentSchemaType,
  "sectionId" | "gradeId"
> & {
  schoolSectionId: string;
};

export default function CreateStudentPage() {
  const { schoolId } = useParams();
  const navigate = useNavigate();

  //LIST ALL GRADES BY SCHOOL QUERY
  const { data: schoolData, loading: isLoadingSchoolData } = useQuery<
    GradesBySchoolQueryResponse,
    { schoolId: string }
  >(GRADES_BY_SCHOOL_QUERY, {
    variables: { schoolId: schoolId! },
    skip: !schoolId,
  });

  const school = schoolData?.school;

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

  return (
    <PageWrapper
      slots={{
        title: "Add Student",
        breadcrumb: (
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
        ),
      }}
    >
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

            <GradeInfo
              isLoading={isLoadingSchoolData}
              schoolData={schoolData?.school}
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
