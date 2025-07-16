import { Outlet } from "react-router";

import { Provider } from "@/provider";

export default function BaseLayout() {
  return (
    <Provider>
      <Outlet />
    </Provider>
  );
}
