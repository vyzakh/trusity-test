import type { BusinessType, PaginationInput } from "@/core/services/types";

export type BasicStudent = {
  id: string;
  name: string;
};

type GradeReference = {
  id: string;
  grade: string;
};

type SectionReference = {
  id: string;
  section: string;
};

type GradeInfo = { grade: { grade: string } } | { text: string };

type SectionInfo = { section: { section: string } } | { text: string };

type DetailedGradeInfo =
  | {
      id: string;
      grade: GradeReference;
    }
  | {
      text: string;
    };

type DetailedSectionInfo =
  | {
      id: string;
      section: SectionReference;
    }
  | {
      text: string;
    };

export type Guardian = {
  name: string;
  email: string;
  contactNumber: string;
};

export type SchoolReference = {
  id: string;
};

export type Student = BasicStudent & {
  contactNumber: string;
  grade: GradeInfo;
  section: SectionInfo;
};

export type StudentDetails = BasicStudent & {
  email: string;
  dateOfBirth: string;
  accountType: BusinessType;
  contactNumber: string;
  school: SchoolReference;
  guardian: Guardian;
  grade: DetailedGradeInfo;
  section: DetailedSectionInfo;
};

export type StudentsQueryResponse = {
  students: Student[];
  totalStudents: number;
};

export type TotalStudentsQueryResponse = {
  totalStudents: number;
};

export type StudentQueryResponse = {
  student: StudentDetails;
};

export type StudentQueryInput = PaginationInput & {
  schoolId?: string;
  teacherId?: string;
  schoolSectionId?: string;
  schoolGradeId?: string;
  name?: string;
  accountType?: BusinessType;
};
