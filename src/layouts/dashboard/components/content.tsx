import React from "react";
import { Outlet } from "react-router";

import RenderFallback from "@/routes/components/RenderFallBack";

export default function Content() {
  return (
    <main className="font-helvetica flex grow flex-col sm:ml-[var(--sidebar-width)]">
      <div
        className="container mx-auto flex max-w-screen-2xl grow flex-col px-4 py-4 sm:py-6 lg:py-8 xl:px-6 2xl:px-8"
        id="dashboard-layout"
      >
        <React.Suspense fallback={<RenderFallback />}>
          <Outlet />
        </React.Suspense>
      </div>
    </main>
  );
}
