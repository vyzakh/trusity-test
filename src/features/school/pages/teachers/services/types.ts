import type { MutationResponse } from "@/core/services/types";
import type { SchoolGradeWithSections } from "@/features/school/services/types";

export type Teacher = {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  grades: SchoolGradeWithSections[];
  school: { id: string; name: string };
};

export type TeacherQueryResponse = {
  teacher: Teacher;
};

export type CreateTeacherPayload = {
  schoolId: string;
  input: {
    name: string;
    email: string;
    contactNumber: string;
    schoolSectionIds: string[];
  };
};

export type UpdateTeacherPayload = {
  teacherId: string;
  input: {
    name: string;
    email: string;
    contactNumber: string;
    schoolSectionIds: string[];
  };
};

export type CreateTeacherResponse = MutationResponse<"createTeacher">;
export type UpdateTeacherResponse = MutationResponse<"updateTeacher">;
