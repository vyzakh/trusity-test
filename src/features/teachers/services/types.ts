import { PaginationInput } from "@/core/services/types";
import { Grade, Section } from "@/features/school/services/types";

export type TeachersQueryResponse = {
  teachers: {
    id: string;
    name: string;
    email: string;
    contactNumber: string;
    grades: {
      grade: Grade;
      sections: {
        section: Section;
      }[];
    }[];
  }[];
  totalTeachers: number;
};

export type TeachersQueryInput = PaginationInput & {
  name?: string;
  schoolId?: string;
};
