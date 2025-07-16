import React from "react";

export const StudentsPage = React.lazy(() => import("./StudentsPage"));
export const CreateStudentPage = React.lazy(
  () => import("./CreateStudentPage"),
);
