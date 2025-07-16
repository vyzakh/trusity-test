import { z } from "zod";

export const CreateGradeSchema = z.object({
  gradeId: z.string().min(1, { message: "Please select a grade" }),
  sectionIds: z
    .array(z.string())
    .min(1, { message: "Please select at least one section" }),
});

export type CreateGradeSchemaType = z.infer<typeof CreateGradeSchema>;
