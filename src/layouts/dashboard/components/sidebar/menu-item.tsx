import { Link } from "react-router";

import ExpandableMenuItem from "./expandable-menu-item";

import { Button } from "@/components/ui";
import useActive from "@/core/hooks/useActive";
import type { TMenuItem } from "../../utils/desktop-menu";

export default function MenuItem(menuItem: Omit<TMenuItem, "key">) {
  const { isActive } = useActive(menuItem.availablekeys);

  return menuItem.children ? (
    <ExpandableMenuItem {...menuItem} />
  ) : (
    <Button
      as={Link}
      className="w-full justify-start transition-colors duration-1000"
      color={isActive ? "primary" : "default"}
      startContent={menuItem.icon}
      to={menuItem.href}
      variant={isActive ? "solid" : "light"}
    >
      {menuItem.label}
    </Button>
  );
}
