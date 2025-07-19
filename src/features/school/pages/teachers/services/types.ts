import type { MutationResponse } from "@/core/services/types";
import type { SchoolGradeWithSections } from "@/features/school/services/types";

export type Teacher = {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  grades: SchoolGradeWithSections[];
};

export type TeacherQueryResponse = {
  teacher: Teacher;
};

export type CreateTeacherResponse = MutationResponse<"createTeacher">;
export type UpdateTeacherResponse = MutationResponse<"updateTeacher">;
