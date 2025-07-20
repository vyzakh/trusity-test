import React from "react";
import { Navigate, type RouteObject } from "react-router";

import RenderFallback from "./components/RenderFallBack";
import RouteGuard from "./components/RouteGuard";

import {
  AdminsPage,
  ChallengesPage,
  CreateGradePage,
  CreateSchoolPage,
  CreateStudentPage,
  CreateTeacherPage,
  DashboardPage,
  GlobalCreateStudentPage,
  GlobalStudentsPage,
  GlobalUpdateStudentPage,
  GradesPage,
  SchoolsPage,
  StudentDetailsPage,
  StudentsPage,
  TeachersPage,
  UpdateGradePage,
  UpdateSchoolPage,
  UpdateStudentPage,
  UpdateTeacherPage,
} from "@/features";
import { GlobalTeachersPage } from "@/features/teachers/pages";
import { DashboardLayout, SchoolLayout } from "@/layouts";

const privateRoutes: RouteObject[] = [
  {
    element: <RouteGuard mode="private" />,
    children: [
      {
        element: (
          <React.Suspense fallback={<RenderFallback />}>
            <DashboardLayout />
          </React.Suspense>
        ),
        children: [
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          {
            path: "challenges",
            element: (
              <div className="">
                <div className="h-screen">Haaaaaai</div>
                <div className="h-screen">Haaaaaai1222</div>
              </div>
            ),
          },
          {
            path: "schools",
            children: [
              {
                index: true,
                element: <SchoolsPage />,
              },
              {
                path: ":schoolId",
                children: [
                  {
                    path: "",
                    element: (
                      <React.Suspense fallback={<RenderFallback />}>
                        <SchoolLayout />
                      </React.Suspense>
                    ),
                    children: [
                      {
                        index: true,
                        element: <Navigate to="students" />,
                      },
                      {
                        path: "students",
                        element: <StudentsPage />,
                      },
                      {
                        path: "teachers",
                        element: <TeachersPage />,
                      },
                      {
                        path: "challenges",
                        element: <ChallengesPage />,
                      },
                      {
                        path: "admins",
                        element: <AdminsPage />,
                      },
                      {
                        path: "grades",
                        element: <GradesPage />,
                      },
                    ],
                  },
                  {
                    path: "update",
                    element: <UpdateSchoolPage />,
                  },
                  {
                    path: "grades",
                    children: [
                      { path: "create", element: <CreateGradePage /> },
                      {
                        path: ":schoolGradeId/update",
                        element: <UpdateGradePage />,
                      },
                    ],
                  },
                  {
                    path: "students",
                    children: [
                      { path: "create", element: <CreateStudentPage /> },
                      {
                        path: ":studentId/update",
                        element: <UpdateStudentPage />,
                      },
                    ],
                  },
                  {
                    path: "teachers",
                    children: [
                      { path: "create", element: <CreateTeacherPage /> },
                      {
                        path: ":teacherId",
                        children: [
                          { index: true, element: null },
                          { path: "update", element: <UpdateTeacherPage /> },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                path: "create",
                element: <CreateSchoolPage />,
              },
            ],
          },
          {
            path: "students",
            children: [
              { index: true, element: <GlobalStudentsPage /> },
              { path: "create", element: <GlobalCreateStudentPage /> },
              {
                path: ":studentId",
                children: [
                  { index: true, element: <StudentDetailsPage /> },
                  { path: "update", element: <GlobalUpdateStudentPage /> },
                ],
              },
            ],
          },

          {
            path: "teachers",
            children: [
              { index: true, element: <GlobalTeachersPage /> },
              // { path: "create", element: <GlobalCreateStudentPage /> },
            ],
          },
        ],
      },
    ],
  },
];

export default privateRoutes;
