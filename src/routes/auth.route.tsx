import { LoginPage } from "@/features";
import { AuthLayout } from "@/layouts";
import type { RouteObject } from "react-router";
import RouteGuard from "./components/RouteGuard";

const authRoutes: RouteObject[] = [
  {
    element: <RouteGuard mode="public" />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
        ],
      },
    ],
  },
];

export default authRoutes;
