import React from "react";

export const GlobalTeachersPage = React.lazy(() => import("./TeachersPage"));
export const GlobalCreateTeachersPage = React.lazy(
  () => import("./CreateTeacherPage"),
);
