export type Grade = {
  id: number;
  grade: string;
};

export type Section = {
  id: number;
  section: string;
};

export type SchoolGradeWithSections = {
  id: string;
  grade: Grade;
  sections: {
    id: string;
    section: Section;
  }[];
};

export type GradesBySchool = {
  id: string;
  name: string;
  grades: SchoolGradeWithSections[];
};

export type GradesBySchoolQueryResponse = {
  school: GradesBySchool;
};
