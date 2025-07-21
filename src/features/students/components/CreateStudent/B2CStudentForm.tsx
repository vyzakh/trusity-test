import { AutocompleteItem } from "@heroui/autocomplete";
import { Form } from "@heroui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import {
  CreateB2CStudentSchema,
  type CreateB2CStudentSchemaType,
} from "../../schemas/studentSchema";

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

import { useMutation, useQuery } from "@apollo/client";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { parseDate } from "@internationalized/date";
import { DateTime } from "luxon";
import { useNavigate } from "react-router";
import { CREATE_B2B_STUDENT_MUTATION } from "../../services/studentMutation";
import {
  STUDENTS_QUERY,
  TOTAL_STUDENTS_QUERY,
} from "../../services/studentQueries";
import type { CreateB2BStudentResponse } from "../../services/types";
import CreateB2CSchoolForm from "../CreateB2CSchoolForm";
import GuardianDetails from "../GuardianDetails";

type CreateStudentInput = Omit<CreateB2CStudentSchemaType, "schoolId">;

export default function B2BStudentForm() {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = React.useState(false);

  //LIST ALL B2B SCHOOLS QUERY
  const { data: b2cSchools, loading: isLoadingSchools } = useQuery<
    SchoolsQueryResponse,
    { accountType: BusinessType }
  >(SCHOOLS_QUERY, {
    variables: { accountType: "B2C" },
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

  //RHF CONFIG
  const methods = useForm<CreateB2CStudentSchemaType>({
    resolver: zodResolver(CreateB2CStudentSchema),
    defaultValues: {
      name: "",
      email: "",
      grade: "",
      section: "",
      schoolId: "",
      contactNumber: "",
      dateOfBirth: "",
      guardian: {
        name: "",
        email: "",
        contactNumber: "",
      },
    },
  });

  //ALL SCHOOLS
  const schools = b2cSchools?.schools || [];

  // STUDENT CREATE HANDLER
  const handleCreateStudent = async (data: CreateB2CStudentSchemaType) => {
    const rest = omitKeys(data, ["schoolId"]);

    try {
      const response = await createStudent({
        variables: {
          accountType: "B2C",
          schoolId: data.schoolId,
          input: {
            ...rest,
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

  //FORM CANCEL HANDLER
  const handleCancel = () => {
    methods.reset();
    navigate("..");
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <React.Fragment>
      <FormProvider {...methods}>
        <Form
          className="flex flex-col gap-4"
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
                labelPlacement="outside-top"
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
                labelPlacement="outside-top"
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
