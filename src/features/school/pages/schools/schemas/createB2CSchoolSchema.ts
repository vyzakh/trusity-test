import { z } from "zod";

export const CreateB2CSchoolSchema = z.object({
  name: z.string().min(1, { message: "School name is required" }),
  address: z.object({
    streetAddressLine1: z
      .string()
      .min(1, { message: "Street address is required" }),
    streetAddressLine2: z.string(),
    countryId: z.string().min(1, { message: "Please select a country" }),
    stateId: z.string().min(1, { message: "Please select a state" }),
    cityId: z.string().min(1, { message: "Please select a city" }),
    postalCode: z.string().min(1, { message: "Postal code is required" }),
  }),
});

export type CreateB2CSchoolSchemaType = z.infer<typeof CreateB2CSchoolSchema>;
