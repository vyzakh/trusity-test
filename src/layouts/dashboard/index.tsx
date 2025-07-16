import Content from "./components/content";
import Header from "./components/header";
import Sidebar from "./components/sidebar";

import { useScrollToTop } from "@/core/hooks/useScrollToTop";

export default function DashboardLayout() {
  useScrollToTop();

  return (
    <div className="radial-background-fixed relative isolate flex grow flex-col">
      <Header />
      <Sidebar />
      <Content />
    </div>
  );
}
