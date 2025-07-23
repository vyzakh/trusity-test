import Content from "./components/content";
import SideDrawer from "./components/drawer";
import Header from "./components/header";
import Sidebar from "./components/sidebar";

import { useScrollToTop } from "@/core/hooks/useScrollToTop";

export default function DashboardLayout() {
  useScrollToTop();

  return (
    <section className="radial-background-fixed relative isolate flex grow flex-col">
      <Header />
      <Sidebar />
      <Content />
      <SideDrawer />
    </section>
  );
}
