import { gql } from "@apollo/client";

export const GRADES_AND_SECTIONS_QUERY = gql`
  query GradesSectionsAndSchool(
    $schoolId: String!
    $includeSchool: Boolean = false
  ) {
    grades {
      id
      grade
    }
    sections {
      id
      section
    }
    school(schoolId: $schoolId) @include(if: $includeSchool) {
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
