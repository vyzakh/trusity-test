import React from "react";

export const GlobalChallengesPage = React.lazy(
  () => import("./ChallengesPage"),
);
export const GlobalCreateChallenge = React.lazy(
  () => import("./CreateChallengePage"),
);

export const GlobalAssignChallengePage = React.lazy(
  () => import("./AssignChallengePage"),
);
export const GlobalChallengeDetailsPage = React.lazy(
  () => import("./ChallengeDetailsPage"),
);
