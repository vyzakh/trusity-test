import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

export const CreateSchoolSchema = z
  .object({
    name: z.string().min(1, { message: "School name is required" }),
    logo: z.string().min(1, { message: "Please upload a school logo" }),
    curriculums: z
      .array(
        z.object({
          id: z
            .number()
            .int()
            .positive({ message: "Curriculum ID must be a positive number" }),
          name: z
            .string()
            .min(1, { message: "Curriculum name is required" })
            .trim(),
          allowCustom: z.boolean(),
        }),
      )
      .min(1, { message: "Please select at least one curriculum" }),

    customCurriculum: z.string().optional(),

    totalLicense: z.number().min(1, ""),

    address: z.object({
      streetAddressLine1: z
        .string()
        .min(1, { message: "Street address is required" }),
      streetAddressLine2: z.string(),
      countryId: z.string().min(1, { message: "Please select a country" }),
      stateId: z.string().min(1, { message: "Please select a state" }),
      cityId: z.string().min(1, { message: "Please select a city" }),
      postalCode: z.string().min(1, { message: "Postal code is required" }),
      contactNumber: z
        .string()
        .min(1, { message: "School contact number is required" })
        .refine((val) => isValidPhoneNumber(val), {
          message: "Please enter a valid phone number",
        }),
    }),

    contact: z.object({
      name: z.string().min(1, { message: "Point of contact name is required" }),
      email: z.email({ message: "Please enter a valid email address" }),
      contactNumber: z
        .string()
        .min(1, { message: "Point of contact number is required" })
        .refine((val) => isValidPhoneNumber(val), {
          message: "Please enter a valid phone number",
        }),
    }),
  })
  .refine(
    (data) => {
      const hasCustomCurriculum = data.curriculums.some((c) => c.allowCustom);

      if (!hasCustomCurriculum) return true;

      return (
        hasCustomCurriculum &&
        data?.customCurriculum &&
        data?.customCurriculum?.trim().length > 0
      );
    },
    {
      message: "Please enter a name for the custom curriculum",
      path: ["customCurriculum"],
    },
  );

export type CreateSchoolSchemaType = z.infer<typeof CreateSchoolSchema>;
