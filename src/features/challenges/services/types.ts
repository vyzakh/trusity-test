import type { MutationResponse, PaginationInput } from "@/core/services/types";

export type ChallengesQueryResponse = {
  challenges: {
    id: string;
    title: string;
    companyName: string;
    createdAt: string;
    creatorType: string;
    createdBy: {
      name: string;
    };
    sdgs: {
      id: string;
      title: string;
    }[];
    sector: {
      id: string;
      name: string;
    };
  }[];
};

export type ChallengesQueryInput = PaginationInput & {};

export type Sector = {
  id: number;
  name: string;
  description: string;
};

export type ChallengeSectorsQueryResponse = {
  challengeSectors: Sector[];
};

export type SDG = {
  id: number;
  title: string;
  description: string;
};

export type SDGsQueryResponse = {
  sdgs: SDG[];
};

export type CreateChallengePayload = {
  title: string;
  companyName: string;
  description: string;
  expectation: string;
  logoUrl: string;
  sdgIds: number[];
  sectorId: number;
};

export type CreateChallengeResponse = MutationResponse<"createChallenge">;
