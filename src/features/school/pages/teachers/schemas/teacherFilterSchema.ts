import { z } from "zod";

export const TeacherFilterSchema = z.object({
  schoolId: z.string().nullable(),
});

export type TeacherFilterSchemaType = z.infer<typeof TeacherFilterSchema>;
