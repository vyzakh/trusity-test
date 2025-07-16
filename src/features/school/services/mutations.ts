import { gql } from "@apollo/client";

export const CREATE_TEACHER_MUTATION = gql`
  mutation CreateTeacher($schoolId: String!, $input: CreateTeacherInput!) {
    createTeacher(schoolId: $schoolId, input: $input) {
      message
    }
  }
`;
