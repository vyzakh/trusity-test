import { Navigate, type RouteObject } from "react-router";

const commonRoutes: RouteObject[] = [
  {
    path: "not-found",
    element: <div>Not found</div>,
  },
  {
    path: "*",
    element: <Navigate to="/not-found" />,
  },
];

export default commonRoutes;
