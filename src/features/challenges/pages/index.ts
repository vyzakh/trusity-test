import React from "react";

export const GlobalChallengesPage = React.lazy(
  () => import("./ChallengesPage"),
);
export const GlobalAddChallenge = React.lazy(() => import("./AddChallenge"));
