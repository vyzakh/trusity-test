import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Input, PhoneInput } from "@/components/ui";

export default function PointOfContact() {
  const { control } = useFormContext();

  return (
    <React.Fragment>
      <Controller
        control={control}
        name="contact.email"
        render={({ field, fieldState: { invalid, error } }) => (
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
        control={control}
        name="contact.name"
        render={({ field, fieldState: { invalid, error } }) => (
          <Input
            {...field}
            isRequired
            errorMessage={error?.message}
            isInvalid={invalid}
            label="Point of Contact"
            labelPlacement="outside"
            placeholder="Name"
            variant="bordered"
          />
        )}
      />
      <Controller
        control={control}
        name="contact.contactNumber"
        render={({ field, fieldState: { invalid, error } }) => (
          <PhoneInput
            {...field}
            isRequired
            defaultCountry="AE"
            errorMessage={error?.message}
            isInvalid={invalid}
            label="Point of Contact Number"
          />
        )}
      />
    </React.Fragment>
  );
}
