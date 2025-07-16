import { Card } from "@heroui/card";
import { Controller, useFormContext } from "react-hook-form";

import { Input, PhoneInput } from "@/components/ui";
import type { CreateB2BStudentSchemaType } from "../schemas/createB2BStudentSchema";

export default function GuardianDetails() {
  const { control } = useFormContext<CreateB2BStudentSchemaType>();

  return (
    <Card className="my-4 flex w-full flex-col gap-5 bg-[#F8F8F8] p-5 shadow-none">
      <h5 className="text-md font-bold">Guardian Details</h5>
      <Controller
        control={control}
        name="guardian.name"
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
        control={control}
        name="guardian.email"
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
        control={control}
        name="guardian.contactNumber"
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
    </Card>
  );
}
