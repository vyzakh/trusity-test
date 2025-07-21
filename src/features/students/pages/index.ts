import React from "react";

export const GlobalStudentsPage = React.lazy(() => import("./StudentsPage"));
export const GlobalCreateStudentPage = React.lazy(
  () => import("./CreateStudentPage"),
);
export const GlobalUpdateStudentPage = React.lazy(
  () => import("./UpdateStudentPage"),
);
export const GlobalStudentDetailsPage = React.lazy(
  () => import("./StudentDetailsPage"),
);
