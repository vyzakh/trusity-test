import { MenuItems } from "../../utils/desktop-menu";

import MenuItem from "./menu-item";

import Scrollbar from "@/components/scrollbar";

export default function Sidebar() {
  return (
    <nav className="font-inter fixed top-[var(--header-height)] bottom-0 left-0 hidden w-[var(--sidebar-width)] p-2 pt-8 sm:block">
      <div
        className="h-full w-full rounded-2xl p-2 py-5"
        style={{
          background: "var(--sidebar-bg)",
        }}
      >
        <Scrollbar className="h-full">
          <ul className="flex flex-col gap-1.5">
            {MenuItems?.map(({ key, ...item }) => {
              return (
                <li key={key}>
                  <MenuItem {...item} />
                </li>
              );
            })}
          </ul>
        </Scrollbar>
      </div>
    </nav>
  );
}
