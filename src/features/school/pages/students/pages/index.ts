import React from "react";

export const StudentsPage = React.lazy(() => import("./StudentsPage"));
export const CreateStudentPage = React.lazy(
  () => import("./CreateStudentPage"),
);
export const UpdateStudentPage = React.lazy(
  () => import("./UpdateStudentPage"),
);
export const StudentDetailsPage = React.lazy(
  () => import("./StudentDetailsPage"),
);
