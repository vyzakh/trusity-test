import { z } from "zod";

import { CreateTeacherSchema as CreateSchoolTeacherSchema } from "@/features/school/pages/teachers/schemas/createTeacherSchema";

export const CreateTeacherSchema = CreateSchoolTeacherSchema.extend({
  schoolId: z.string().min(1, "Please select a school."),
});

export type CreateTeacherSchemaType = z.infer<typeof CreateTeacherSchema>;
