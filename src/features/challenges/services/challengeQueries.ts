import { gql } from "@apollo/client";

export const CHALLENGES_QUERY = gql`
  query Challenges($type: ChallengeCreatorType) {
    challenges(type: $type) {
      companyName
      createdAt
      createdBy {
        ... on PlatformUser {
          name
        }
      }
      creatorType
      id
      sdgs {
        id
        title
      }
      sector {
        id
        name
      }
      title
    }
  }
`;

export const CHALLENGE_SECTORS_QUERY = gql`
  query ChallengeSectors {
    challengeSectors {
      id
      name
      description
    }
  }
`;

export const SDGS_QUERY = gql`
  query Sdgs {
    sdgs {
      id
      title
      description
    }
  }
`;
