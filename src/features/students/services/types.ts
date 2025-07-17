import type { BusinessType, PaginationInput } from "@/core/services/types";

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

export type TotalStudentsQueryResponse = {
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

export type StudentQueryResponse = {
  student: {
    id: string;
    name: string;
    email: string;
    dateOfBirth: string;
    accountType: string;
    contactNumber: string;
    guardian: {
      name: string;
      email: string;
      contactNumber: string;
    };
    grade:
      | {
          id: string;
          grade: {
            id: string;
            grade: string;
          };
        }
      | {
          text: string;
        };
    section:
      | {
          text: string;
        }
      | {
          id: string;
          section: {
            id: string;
            section: string;
          };
        };
  };
};
