import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

export const CreateB2BStudentSchema = z.object({
  name: z.string().min(1, "Student name is required."),
  email: z
    .email("Enter a valid email address.")
    .min(1, "Student email is required."),
  contactNumber: z
    .string()
    .min(1, "Contact number is required.")
    .refine((val) => isValidPhoneNumber(val), {
      message: "Enter a valid phone number.",
    }),
  dateOfBirth: z.string().min(1, "Date of birth is required."),
  gradeId: z.string().min(1, "Please select a grade."),
  sectionId: z.string().min(1, "Section is required."),
  guardian: z.object({
    name: z.string().min(1, "Guardian name is required."),
    email: z
      .email("Enter a valid guardian email address.")
      .min(1, "Guardian email is required."),
    contactNumber: z
      .string()
      .min(1, "Guardian contact number is required.")
      .refine((val) => isValidPhoneNumber(val), {
        message: "Enter a valid guardian phone number.",
      }),
  }),
});

export type CreateB2BStudentSchemaType = z.infer<typeof CreateB2BStudentSchema>;
