import { z } from "zod";

import { CreateB2BStudentSchema } from "@/features/school/pages/students/schemas/createB2BStudentSchema";

export const CreateStudentSchema = CreateB2BStudentSchema.extend({
  schoolId: z.string().min(1, "Please select a school."),
});

export type CreateStudentSchemaType = z.infer<typeof CreateStudentSchema>;

export const CreateB2CStudentSchema = CreateB2BStudentSchema.omit({
  gradeId: true,
  sectionId: true,
}).extend({
  schoolId: z.string().min(1, "Please select a school."),
  grade: z.string().min(1, "Grade is required."),
  section: z.string().min(1, "Section is required."),
});

export type CreateB2CStudentSchemaType = z.infer<typeof CreateB2CStudentSchema>;
