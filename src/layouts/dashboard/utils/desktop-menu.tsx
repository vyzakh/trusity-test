import SvgColor from "@/components/svg-color";
import type { JSX } from "react";

export type TSubmenuItem = {
  label: string;
  key: string;
  href: string;
};

export type TMenuItem = {
  label: string;
  key: string;
  href?: string;
  icon: JSX.Element | null;
  activeicon: JSX.Element | null;
  children?: TSubmenuItem[];
  availablekeys: string[];
};

export const icon = (name: string) => (
  <SvgColor
    src={`/icons/dashboard/sidebar/${name}.svg`}
    style={{ width: "var(--nav-icon-size)", height: "var(--nav-icon-size)" }}
  />
);

export const MenuItems: TMenuItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: icon("ChartPieSlice"),
    activeicon: icon("ChartPieSlice"),
    availablekeys: ["dashboard"],
    href: "/dashboard",
  },
  {
    key: "challenges",
    label: "Challenges",
    icon: icon("Crosshair"),
    activeicon: icon("Crosshair"),
    availablekeys: ["challenges"],
    href: "/challenges",
  },
  {
    key: "management",
    label: "Management",
    icon: icon("GearSix"),
    activeicon: icon("GearSix"),
    availablekeys: ["schools", "students", "classes", "teachers"],
    href: "/management",
    children: [
      {
        key: "schools",
        label: "Schools",
        href: "/schools",
      },
      {
        key: "students",
        label: "Students",
        href: "/students",
      },
      {
        key: "teachers",
        label: "Teachers",
        href: "/teachers",
      },
    ],
  },
  // {
  //   key: "learning-files",
  //   label: "Learning Files",
  //   icon: icon("Crosshair"),
  //   activeicon: icon("Crosshair"),
  //   availablekeys: ["learning-files"],
  //   href: "#",
  // },
  // {
  //   key: "roll-management",
  //   label: "Roll Management",
  //   icon: icon("Crosshair"),
  //   activeicon: icon("Crosshair"),
  //   availablekeys: ["roll-management"],
  //   href: "#",
  // },
];
