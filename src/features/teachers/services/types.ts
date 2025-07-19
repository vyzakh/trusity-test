import type { PaginationInput } from "@/core/services/types";
import type { Teacher } from "@/features/school/pages/teachers/services/types";

export type TeachersQueryResponse = {
  teachers: Teacher[];
};

export type TeachersQueryInput = PaginationInput & {
  name?: string;
  schoolId?: string;
};

export type TotalTeachersQueryResponse = {
  totalTeachers: number;
};
