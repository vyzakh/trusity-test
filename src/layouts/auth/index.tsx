import React from "react";
import { Outlet } from "react-router";

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout: React.FC<AuthLayoutProps> = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
