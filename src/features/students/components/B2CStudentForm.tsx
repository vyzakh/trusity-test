import { AutocompleteItem } from "@heroui/autocomplete";
import { Form } from "@heroui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import {
  CreateB2CStudentSchema,
  CreateB2CStudentSchemaType,
} from "../schemas/createStudentSchema";

import {
  Autocomplete,
  Button,
  DatePicker,
  Input,
  PhoneInput,
} from "@/components/ui";
import { GuardianDetails } from "@/features/school/pages/students/components";

export default function B2CStudentForm() {
  //RHF CONFIG
  const methods = useForm<CreateB2CStudentSchemaType>({
    resolver: zodResolver(CreateB2CStudentSchema),
    defaultValues: {
      name: "",
      email: "",
      grade: "",
      section: "",
      contactNumber: "",
      dateOfBirth: undefined,
      guardian: {
        name: "",
        email: "",
        contactNumber: "",
      },
    },
  });

  // STUDENT CREATE HANDLER
  const handleCreateStudent = async (data: CreateB2CStudentSchemaType) => {
    // try {
    //   const response = await createStudent({
    //     variables: {
    //       schoolId: schoolId!,
    //       input: {
    //         ...data,
    //         sectionId: Number(data.sectionId),
    //         gradeId: Number(data.gradeId),
    //       },
    //     },
    //   });
    //   addToast({
    //     title: response?.data?.createB2BStudent?.message,
    //     color: "danger",
    //   });
    //   handleCancel();
    // } catch (error) {
    //   const errMsg = handleApolloError(error);
    //   addToast({ title: errMsg, color: "danger" });
    // }
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
                // {...field}
                isRequired
                showMonthAndYearPickers
                classNames={{ inputWrapper: "shadow-none border-1" }}
                errorMessage={error?.message}
                isInvalid={invalid}
                label="Date of Birth"
                labelPlacement="outside"
                // value={field?.value ? parseDate(field.value) : undefined}
                variant="bordered"
                // onChange={(val) => {
                //   if (val) {
                //     const formatted = DateTime.fromObject({
                //       year: val.year,
                //       month: val.month,
                //       day: val.day,
                //     }).toFormat("yyyy-MM-dd");

                //     field.onChange(formatted);
                //   } else {
                //     field.onChange(null);
                //   }
                // }}
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
                // isDisabled={selectedGrade === ""}
                isInvalid={invalid}
                // items={sections}
                label="School Name"
                labelPlacement="outside"
                name={field.name}
                placeholder="Select"
                selectedKey={field.value}
                variant="bordered"
                onBlur={field.onBlur}
                onSelectionChange={(e) => field.onChange(e)}
              >
                <AutocompleteItem key="1">1</AutocompleteItem>
              </Autocomplete>
            )}
          />

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
                labelPlacement="outside"
                placeholder="Grade"
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
                labelPlacement="outside"
                placeholder="Section"
                variant="bordered"
              />
            )}
          />
          <div className="flex w-full items-center justify-end gap-2">
            <Button
              className="h-9"
              color="default"
              // disabled={isCreating}
              type="reset"
              variant="flat"
              // onPress={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className="h-9"
              color="primary"
              // isLoading={isCreating}
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
