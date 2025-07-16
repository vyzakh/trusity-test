import { useLocation } from "react-router";

export default function useActive(availableKeys: string[]) {
  const { pathname } = useLocation();
  const activeKey = pathname.split("/")[1] || "dashboard";

  return {
    activeKey,
    isActive: availableKeys.includes(activeKey),
  };
}
