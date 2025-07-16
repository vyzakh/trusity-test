import { Outlet } from "react-router";

type RouteGuardProps = {
  mode: "private" | "public";
};

export default function RouteGuard({}: RouteGuardProps) {
  // const { accessToken } = useAppSelector((state) => state.auth);
  // if (accessToken !== null && mode === 'public') {
  //   return <Navigate to="/incidents" />;
  // } else if (accessToken === null && mode === 'private') {
  //   return <Navigate to="/login" />;
  // }

  return <Outlet />;
}
