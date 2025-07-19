import { z } from "zod";

import { CreateB2BStudentSchema as CreateStudentSchema } from "@/features/school/pages/students/schemas/createB2BStudentSchema";

export const CreateB2BStudentSchema = CreateStudentSchema.extend({
  schoolId: z.string().min(1, "Please select a school."),
});

export type CreateB2BStudentSchemaType = z.infer<typeof CreateB2BStudentSchema>;

export const CreateB2CStudentSchema = CreateB2BStudentSchema.omit({
  gradeId: true,
  sectionId: true,
}).extend({
  schoolId: z.string().min(1, "Please select a school."),
  grade: z.string().min(1, "Grade is required."),
  section: z.string().min(1, "Section is required."),
});

export type CreateB2CStudentSchemaType = z.infer<typeof CreateB2CStudentSchema>;

export type UpdateB2BStudentSchemaType = Omit<
  CreateB2BStudentSchemaType,
  "email"
>;
