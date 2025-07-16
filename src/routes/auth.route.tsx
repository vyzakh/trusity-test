import type { RouteObject } from "react-router";
import RouteGuard from "./components/RouteGuard";

const authRoutes: RouteObject[] = [
  {
    element: <RouteGuard mode="public" />,
    children: [
      {
        element: <div>dd</div>,
        children: [
          {
            path: "login",
            element: <div>login</div>,
          },
        ],
      },
      // {
      //   path: '/forgot-password/check-email',
      //   element: <ForgotPasswordSuccessNoticePage />,
      // },
      // {
      //   path: '/reset-password/success',
      //   element: <ResetPasswordSuccessNoticePage />,
      // },
      // {
      //   path: 'verify-email',
      //   element: <EmailVerificationNoticePage />,
      // },
      // {
      //   path: 'acc-verification/:token',
      //   element: <AccountVerificationPage />,
      // },
    ],
  },
];

export default authRoutes;
