import React from "react";

export const TeachersPage = React.lazy(() => import("./TeachersPage"));
export const CreateTeacherPage = React.lazy(
  () => import("./CreateTeacherPage"),
);
export const UpdateTeacherPage = React.lazy(
  () => import("./UpdateTeacherPage"),
);
