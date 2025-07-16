import React from "react";
import { Outlet } from "react-router";

import RenderFallback from "@/routes/components/RenderFallBack";

export default function Content() {
  return (
    <main className="font-helvetica flex grow flex-col sm:ml-[var(--sidebar-width)]">
      <div
        className="container flex max-w-screen-2xl grow flex-col py-4"
        id="dashboard-layout"
      >
        <React.Suspense fallback={<RenderFallback />}>
          <Outlet />
        </React.Suspense>
      </div>
    </main>
  );
}
