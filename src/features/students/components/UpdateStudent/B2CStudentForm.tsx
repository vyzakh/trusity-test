import { useMutation, useQuery } from "@apollo/client";
import { AutocompleteItem } from "@heroui/autocomplete";
import { Form } from "@heroui/form";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseDate } from "@internationalized/date";
import { DateTime } from "luxon";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

import {
  Autocomplete,
  Button,
  DatePicker,
  Input,
  PhoneInput,
} from "@/components/ui";
import { handleApolloError } from "@/core/errors";
import type { BusinessType } from "@/core/services/types";
import { omitKeys } from "@/core/utils/object";
import type { CreateB2CSchoolSchemaType } from "@/features/school/pages/schools/schemas/createB2CSchoolSchema";
import { CREATE_SCHOOL_MUTATION } from "@/features/school/pages/schools/services/schoolMutations";
import {
  SCHOOLS_QUERY,
  TOTAL_SCHOOLS_QUERY,
} from "@/features/school/pages/schools/services/schoolQueries";
import type {
  CreateB2CSchoolPayload,
  CreateSchoolResponse,
  SchoolsQueryResponse,
} from "@/features/school/pages/schools/services/types";
import { UPDATE_STUDENT_MUTATION } from "@/features/school/pages/students/services/studentMutations";
import type { UpdateB2BStudentResponse } from "@/features/school/pages/students/services/types";
import { STUDENTS_QUERY } from "@/features/students/services/studentQueries";
import type { StudentQueryResponse } from "@/features/students/services/types";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import {
  CreateB2CStudentSchema,
  type CreateB2CStudentSchemaType,
} from "../../schemas/studentSchema";
import CreateB2CSchoolForm from "../CreateB2CSchoolForm";
import GuardianDetails from "../GuardianDetails";

type UpdateB2CStudentSchemaType = Omit<CreateB2CStudentSchemaType, "email">;

type B2CStudentFormProps = {
  studentData: StudentQueryResponse["student"];
};

type UpdateB2CStudentInput = Omit<UpdateB2CStudentSchemaType, "schoolId">;

export default function B2CStudentForm({ studentData }: B2CStudentFormProps) {
  const { studentId, schoolId } = useParams();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = React.useState(false);

  //LIST ALL B2B SCHOOLS QUERY
  const { data: b2cSchools, loading: isLoadingSchools } = useQuery<
    SchoolsQueryResponse,
    { accountType: BusinessType }
  >(SCHOOLS_QUERY, {
    variables: { accountType: "B2C" },
  });

  //ALL SCHOOLS
  const schools = b2cSchools?.schools || [];

  //CREATE SCHOOL MUTATION
  const [createSchool, { loading: isCreatingSchool }] = useMutation<
    CreateSchoolResponse,
    { input: CreateB2CSchoolPayload }
  >(CREATE_SCHOOL_MUTATION, {
    refetchQueries: [
      { query: SCHOOLS_QUERY, variables: { accountType: "B2C" } },
      { query: TOTAL_SCHOOLS_QUERY },
    ],
  });

  //CREATE B2B STUDENT MUTATION
  const [updateStudent, { loading: isCreating }] = useMutation<
    UpdateB2BStudentResponse,
    {
      studentId: string;
      accountType: BusinessType;
      input: UpdateB2CStudentInput;
    }
  >(UPDATE_STUDENT_MUTATION, {
    refetchQueries: [
      {
        query: STUDENTS_QUERY,
        variables: { limit: 10, offset: 0, schoolId },
      },
    ],
  });

  //RHF CONFIG
  const methods = useForm<UpdateB2CStudentSchemaType>({
    resolver: zodResolver(CreateB2CStudentSchema.omit({ email: true })),
    defaultValues: {
      name: "",
      contactNumber: "",
      dateOfBirth: "",
      guardian: {
        name: "",
        email: "",
        contactNumber: "",
      },
    },
  });

  // STUDENT CREATE HANDLER
  const handleUpdateStudent = async (data: UpdateB2CStudentSchemaType) => {
    const rest = omitKeys(data, ["schoolId"]);
    try {
      const response = await updateStudent({
        variables: {
          studentId: studentId!,
          accountType: "B2C",
          input: {
            ...rest,
          },
        },
      });

      addToast({
        title: response?.data?.updateStudent?.message,
        color: "success",
      });
      navigate("..");
    } catch (error) {
      const errMsg = handleApolloError(error);

      addToast({ title: errMsg, color: "danger" });
    }
  };

  //CREATE SCHOOL HANDLER
  const handleCreateSchool = async (data: CreateB2CSchoolSchemaType) => {
    try {
      const response = await createSchool({
        variables: { input: { ...data, accountType: "B2C" } },
      });

      methods.setValue("schoolId", response.data?.createSchool.school.id ?? "");

      addToast({
        color: "success",
        title: response.data?.createSchool.message,
      });
      handleCloseModal();
    } catch (error) {
      const errMsg = handleApolloError(error);
      addToast({ color: "danger", title: errMsg });
    }
  };

  const handleReset = React.useCallback(() => {
    if (studentData) {
      const {
        name,
        dateOfBirth,
        contactNumber,
        guardian,
        school,
        grade,
        section,
      } = studentData;
      methods.reset({
        name,
        contactNumber,
        dateOfBirth: DateTime.fromISO(dateOfBirth, { zone: "utc" })
          .toLocal()
          .toFormat("yyyy-MM-dd"),
        schoolId: school.id,
        grade: "text" in grade ? grade.text : "",
        section: "text" in section ? section.text : "",
        guardian: {
          name: guardian.name,
          email: guardian.email,
          contactNumber: guardian.contactNumber,
        },
      });
    }
  }, [methods, studentData]);

  React.useEffect(() => {
    handleReset();
  }, [handleReset]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <React.Fragment>
      <FormProvider {...methods}>
        <Form
          className="flex flex-col gap-4"
          validationBehavior="aria"
          onSubmit={methods.handleSubmit(handleUpdateStudent)}
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
                labelPlacement="outside-top"
                placeholder="Student name"
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

          <div className="relative w-full">
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
                    <AutocompleteItem
                      color={school.id === "-1" ? "secondary" : "default"}
                      key={school.id}
                      textValue={school.name}
                    >
                      {school.name}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              )}
            />
            <Button
              variant="light"
              disableRipple
              size="sm"
              className="absolute top-0 right-0 z-10 h-auto min-h-auto p-0 underline data-[hover=true]:bg-transparent"
              color="primary"
              onPress={() => setOpenModal(true)}
            >
              Create a new school
            </Button>
          </div>
          <Controller
            control={methods.control}
            name="grade"
            render={({ field, fieldState: { invalid, error } }) => (
              <Input
                {...field}
                isRequired
                errorMessage={error?.message}
                isInvalid={invalid}
                label="Grade"
                labelPlacement="outside-top"
                variant="bordered"
              />
            )}
          />

          <Controller
            control={methods.control}
            name="section"
            render={({ field, fieldState: { invalid, error } }) => (
              <Input
                {...field}
                isRequired
                errorMessage={error?.message}
                isInvalid={invalid}
                label="Section"
                labelPlacement="outside-top"
                variant="bordered"
              />
            )}
          />
          <div className="flex w-full items-center justify-end gap-2">
            <Button
              className="h-9"
              color="default"
              disabled={isCreating}
              variant="flat"
              onPress={handleReset}
            >
              Reset
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

      <Modal
        isOpen={openModal}
        scrollBehavior="inside"
        onClose={handleCloseModal}
        hideCloseButton={isCreatingSchool}
        isDismissable={!isCreatingSchool}
        isKeyboardDismissDisabled={isCreatingSchool}
      >
        <ModalContent>
          <ModalHeader className="text-2xl">Create School</ModalHeader>
          <ModalBody className="pb-5">
            <CreateB2CSchoolForm
              handleCancel={handleCloseModal}
              handleCreateSchool={handleCreateSchool}
              isCreatingSchool={isCreatingSchool}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
}
