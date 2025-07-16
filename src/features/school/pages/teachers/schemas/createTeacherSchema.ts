import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

export const CreateTeacherSchema = z.object({
  name: z.string().min(1, "Please enter the teacher's name"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  contactNumber: z
    .string()
    .min(1, "Contact number is required")
    .refine((val) => isValidPhoneNumber(val), {
      message: "Please enter a valid phone number",
    }),
  grades: z
    .array(
      z.object({
        id: z.string(),
        grade: z.string(),
        sections: z.array(z.object({ id: z.string(), section: z.string() })),
      }),
    )
    .min(1, "Please add atleast one grade."),
});

export type CreateTeacherSchemaType = z.infer<typeof CreateTeacherSchema>;
