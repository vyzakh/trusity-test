import type { MutationResponse } from "@/core/services/types";
import type {
  Grade,
  GradesBySchool,
  Section,
} from "@/features/school/services/types";

export type GradesSectionsAndSchoolQueryResponse = {
  grades: Grade[];
  sections: Section[];
  school: GradesBySchool;
};

export type CreateSchoolGradeResponse = MutationResponse<"createSchoolGrade">;
export type UpdateSchoolGradeResponse = MutationResponse<"updateSchoolGrade">;
export type DeleteSchoolGradeResponse = MutationResponse<"deleteSchoolGrade">;
