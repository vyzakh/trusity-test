import { gql } from "@apollo/client";

export const CREATE_GRADE_MUTATION = gql`
  mutation CreateSchoolGrade(
    $schoolId: String!
    $input: CreateSchoolGradeInput!
  ) {
    createSchoolGrade(schoolId: $schoolId, input: $input) {
      message
    }
  }
`;

export const UPDATE_GRADE_MUTATION = gql`
  mutation UpdateSchoolGrade(
    $schoolGradeId: String!
    $input: UpdateSchoolGradeInput!
  ) {
    updateSchoolGrade(schoolGradeId: $schoolGradeId, input: $input) {
      message
    }
  }
`;

export const DELETE_GRADE_MUTATION = gql`
  mutation DeleteGrade($schoolGradeId: String!) {
    deleteSchoolGrade(schoolGradeId: $schoolGradeId) {
      message
    }
  }
`;
