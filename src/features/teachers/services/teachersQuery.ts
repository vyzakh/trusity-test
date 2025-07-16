import { gql } from "@apollo/client";

export const TEACHERS_QUERY = gql`
  query Students($schoolId: String, $name: String, $limit: Int, $offset: Int) {
    teachers(schoolId: $schoolId, name: $name, limit: $limit, offset: $offset) {
      id
      name
      email
      contactNumber
      grades {
        grade {
          id
          grade
        }
        sections {
          section {
            id
            section
          }
        }
      }
    }
    totalTeachers(name: $name)
  }
`;
