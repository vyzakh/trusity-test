import { gql } from "@apollo/client";

export const CREATE_B2B_STUDENT_MUTATION = gql`
  mutation CreateStudent(
    $schoolId: String!
    $accountType: BusinessModel!
    $input: CreateStudentInput!
  ) {
    createStudent(
      schoolId: $schoolId
      accountType: $accountType
      input: $input
    ) {
      message
    }
  }
`;

export const UPDATE_STUDENT_MUTATION = gql`
  mutation UpdateStudent(
    $studentId: String!
    $accountType: BusinessModel!
    $input: UpdateStudentInput!
  ) {
    updateStudent(
      studentId: $studentId
      accountType: $accountType
      input: $input
    ) {
      message
    }
  }
`;
