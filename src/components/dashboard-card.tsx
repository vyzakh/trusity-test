import { Card } from "@heroui/card";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import React from "react";

import SvgColor from "@/components/svg-color";

type DasboardCardProps = {
  icon: string;
  count: number;
  label: string;
  color: string;
  bgColor?: string;
  iconBg?: string;
};

export default function DasboardCard({
  count: totalCount,
  icon,
  label,
  color,
  bgColor = "var(--sidebar-bg)",
  iconBg = "rgb(255 255 255 / 0.5)",
}: DasboardCardProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(() => Math.round(count.get()));

  React.useEffect(() => {
    const controls = animate(count, totalCount, { duration: 1 });

    return () => controls.stop();
  }, []);

  return (
    <Card classNames={{ base: "shadow-none" }}>
      <div
        className="bg-primary flex h-full items-center gap-4 px-5 py-8 lg:gap-2"
        style={{ background: bgColor }}
      >
        <div
          className={`grid place-items-center rounded-full p-3`}
          style={{ color, background: iconBg }}
        >
          <motion.div
            animate={{ y: 0 }}
            className="grid size-8 place-items-center"
            initial={{ y: -50 }}
          >
            <SvgColor
              src={`/icons/dashboard/card/${icon}.svg`}
              style={{ width: "30px", height: "30px" }}
            />
          </motion.div>
        </div>
        <div className="flex grow flex-col justify-between gap-1">
          <motion.h1 className="text-3xl" style={{ color }}>
            {rounded}
          </motion.h1>
          <p className="line-clamp-1 text-sm text-[#303030]">{label}</p>
        </div>
      </div>
    </Card>
  );
}
