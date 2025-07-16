import { gql } from "@apollo/client";

export const GRADES_BY_SCHOOL_QUERY = gql`
  query Grades($schoolId: String!) {
    school(schoolId: $schoolId) {
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
