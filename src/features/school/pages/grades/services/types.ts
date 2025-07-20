import type { MutationResponse } from "@/core/services/types";
import type {
  Grade,
  GradesBySchool,
  Section,
} from "@/features/school/services/types";

export type GradesAndSectionsQueryResponse = {
  grades: Grade[];
  sections: Section[];
};

export type GradesSectionsAndSchoolQueryResponse =
  GradesAndSectionsQueryResponse & {
    school: GradesBySchool;
  };

export type GradesSectionsAndSchoolQueryInput = {
  schoolId: string;
  includeSchool: boolean;
};

export type CreateSchoolGradeResponse = MutationResponse<"createSchoolGrade">;
export type UpdateSchoolGradeResponse = MutationResponse<"updateSchoolGrade">;
export type DeleteSchoolGradeResponse = MutationResponse<"deleteSchoolGrade">;
