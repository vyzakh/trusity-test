import { gql } from "@apollo/client";

export const CREATE_CHALLENGE_MUTATION = gql`
  mutation CreateChallenge($input: CreateChallengeInput!) {
    createChallenge(input: $input) {
      message
    }
  }
`;
