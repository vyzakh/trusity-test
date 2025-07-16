import { createBrowserRouter, Navigate, type RouteObject } from "react-router";

import authRoutes from "./auth.route";
import commonRoutes from "./common.route";
import privateRoutes from "./private.route";

import BaseLayout from "@/layouts/base";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <BaseLayout />,
    children: [
      {
        index: true,
        element: <Navigate replace to="/dashboard" />,
      },
      ...privateRoutes,
      ...authRoutes,
      ...commonRoutes,
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
