import { gql } from "@apollo/client";

export const STUDENTS_QUERY = gql`
  query Students(
    $schoolId: String
    $teacherId: String
    $schoolSectionId: String
    $schoolGradeId: String
    $name: String
    $offset: Int
    $limit: Int
    $accountType: BusinessModel
  ) {
    students(
      schoolId: $schoolId
      teacherId: $teacherId
      schoolSectionId: $schoolSectionId
      schoolGradeId: $schoolGradeId
      name: $name
      offset: $offset
      limit: $limit
      accountType: $accountType
    ) {
      id
      name
      contactNumber
      grade {
        ... on B2BStudentGrade {
          id
          grade {
            id
            grade
          }
        }
        ... on B2CStudentGrade {
          text
        }
      }
      section {
        ... on B2CStudentSection {
          text
        }
        ... on B2BStudentSection {
          id
          section {
            id
            section
          }
        }
      }
    }
    totalStudents(name: $name)
  }
`;
