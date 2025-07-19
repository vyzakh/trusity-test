import { cn } from "@heroui/theme";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { Link, useLocation } from "react-router";

import { Button } from "@/components/ui";
import useActive from "@/core/hooks/useActive";
import type { TMenuItem } from "../../utils/desktop-menu";

const parentVariants = {
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1,
      // delayChildren: 0.1,
    },
  },
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.2,
      staggerDirection: -1,
    },
  },
};

const childVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2 },
  },
  closed: {
    opacity: 0,
    y: -5,
    transition: { duration: 0.15 },
  },
};

export default function ExpandableMenuItem({
  children,
  label,
  availablekeys,
  icon,
}: Omit<TMenuItem, "key">) {
  const { isActive, activeKey } = useActive(availablekeys);
  const [open, setOpen] = React.useState(false);

  const { pathname } = useLocation();
  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  React.useEffect(() => {
    if (isActive) {
      setOpen(isActive);
    }
  }, [pathname, isActive]);

  return (
    <div
      className="rounded-lg"
      style={{ background: isActive || open ? "var(--submenu-bg)" : "inherit" }}
    >
      <Button
        className="flex w-full justify-start"
        color={isActive ? "primary" : "default"}
        endContent={
          <motion.svg
            animate={{ rotate: open ? -180 : 0 }}
            className="ml-auto"
            fill="none"
            height="8"
            initial={false}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            viewBox="0 0 15 8"
            width="15"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 0.75L7.5 7.25L1 0.75"
              stroke="#929292"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </motion.svg>
        }
        startContent={icon}
        variant={isActive ? "solid" : "light"}
        onPress={handleToggle}
      >
        {label}
      </Button>
      <AnimatePresence initial={false} mode="sync">
        {open && (
          <motion.section
            animate="open"
            className="overflow-hidden"
            exit="closed"
            initial="closed"
            variants={parentVariants}
          >
            <div className="ps-8">
              <div className="mt-0.5 p-1">
                <ul className="relative flex flex-col gap-1 before:absolute before:-top-[6px] before:bottom-[calc(var(--nav-item-sub-height)_/_2_+_6px)] before:-left-3 before:w-[2px] before:bg-[#c5cede] before:transition-all before:content-['']">
                  {children?.map((submenu) => {
                    const isActiveSubmenu = activeKey === submenu.key;

                    return (
                      <motion.li
                        key={submenu.key}
                        className="sub-nav-item relative"
                        variants={childVariants}
                      >
                        <Button
                          as={Link}
                          className={cn(
                            "text-primary-text w-full justify-start text-sm",
                            isActiveSubmenu && "text-primary font-semibold",
                          )}
                          color="primary"
                          size="sm"
                          to={submenu.href}
                          variant={isActiveSubmenu ? "flat" : "light"}
                        >
                          {submenu.label}
                        </Button>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
