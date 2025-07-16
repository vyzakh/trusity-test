import { gql } from "@apollo/client";

export const CREATE_SCHOOL_MUTATION = gql`
  mutation CreateSchools($input: CreateSchoolInput!) {
    createSchool(input: $input) {
      message
    }
  }
`;

export const UPDATE_SCHOOL_MUTATION = gql`
  mutation UpdateSchool($schoolId: String!, $input: UpdateSchoolInput!) {
    updateSchool(schoolId: $schoolId, input: $input) {
      message
    }
  }
`;
