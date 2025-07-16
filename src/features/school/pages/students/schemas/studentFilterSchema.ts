import { z } from "zod";

export const StudentFilterSchema = z.object({
  schoolGradeId: z.string().nullable(),
  schoolSectionId: z.string().nullable(),
});

export type StudentFilterSchemaType = z.infer<typeof StudentFilterSchema>;
