import { gql } from "@apollo/client";

export const GRADES_SECTIONS_AND_SCHOOL_QUERY = gql`
  query GradesSectionsAndSchool($schoolId: String!) {
    grades {
      id
      grade
    }
    sections {
      id
      section
    }
    school(schoolId: $schoolId) {
      id
      name
      grades {
        id
        grade {
          id
          grade
        }
        sections {
          id
          section {
            id
            section
          }
        }
      }
    }
  }
`;
