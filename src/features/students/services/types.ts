import { BusinessType, PaginationInput } from "@/core/services/types";

export type StudentsQueryResponse = {
  students: {
    id: string;
    name: string;
    contactNumber: string;
    grade: { grade: { grade: string } } | { text: string };
    section: { section: { section: string } } | { text: string };
  }[];
  totalStudents: number;
};

export type StudentQueryInput = PaginationInput & {
  schoolId?: string;
  teacherId?: string;
  schoolSectionId?: string;
  schoolGradeId?: string;
  name?: string;
  accountType?: BusinessType;
};
