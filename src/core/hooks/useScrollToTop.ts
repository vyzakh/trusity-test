import React from "react";
import { useLocation } from "react-router";

export function useScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    const isExactSchoolSubRoute =
      /^\/schools\/\d+\/(teachers|grades|students)$/.test(pathname);

    if (!isExactSchoolSubRoute) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname]);

  return null;
}
