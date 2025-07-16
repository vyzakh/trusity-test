import { gql } from "@apollo/client";

export const TEACHER_QUERY = gql`
  query Teacher($teacherId: String!) {
    teacher(teacherId: $teacherId) {
      id
      name
      email
      contactNumber
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
