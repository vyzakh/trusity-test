import { Card } from "@heroui/card";
import { Image } from "@heroui/image";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import React from "react";
import { Link } from "react-router";

import SvgColor from "@/components/svg-color";

type MostParticipatedChallengeCardProps = {
  count: number;
};

export default function MostParticipatedChallengeCard({
  count: totalCount,
}: MostParticipatedChallengeCardProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(() => Math.round(count.get()));

  React.useEffect(() => {
    const controls = animate(count, totalCount, { duration: 1 });

    return () => controls.stop();
  }, []);

  return (
    <Card
      className="group h-full min-h-20 overflow-hidden rounded-xl text-white"
      classNames={{ base: "shadow-none" }}
      style={{ background: "var(--sidebar-bg)" }}
    >
      <div className="grid h-full w-full grid-cols-1 overflow-hidden md:grid-cols-3 lg:grid-cols-2">
        <Image
          className="h-full w-full rounded-none object-cover"
          classNames={{
            wrapper:
              "w-full h-52 rounded-none !max-w-full lg:h-full overflow-hidden",
            img: "rounded-none group-hover:scale-110",
          }}
          src="tik-tok.jpg"
          style={{ maxWidth: "100%" }}
        />

        <div className="col-span-2 flex h-full w-full flex-col justify-between gap-5 px-5 py-5 text-[#31312F] lg:col-span-1 lg:gap-5 lg:py-8 xl:py-5">
          <div className="flex flex-col gap-2">
            <p className="text-sm">Most participated challenge</p>
            <div className="flex items-end gap-2">
              <SvgColor
                src="/icons/dashboard/card/Group-2.svg"
                style={{ width: "28px", height: "28px" }}
              />
              <motion.span className="text-2xl !leading-none lg:text-3xl">
                {rounded}
              </motion.span>
              <span className="text-sm">Students</span>
            </div>
          </div>
          <h1 className="text-lg font-bold lg:text-xl">
            Tiktok
            <br /> Digital Marketing
          </h1>
          <Link
            className="group/link inline-flex w-max items-center gap-3 transition-colors duration-500"
            to="#"
          >
            <p className="group-hover/link:text-secondary text-sm duration-500">
              View Details
            </p>
            <div className="group-hover/link:bg-secondary grid size-9 place-items-center rounded-full bg-[#5a5a5a33] transition-colors duration-500">
              <svg
                fill="none"
                height="16"
                viewBox="0 0 9 16"
                width="9"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.25 1.5L7.75 8L1.25 14.5"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </Card>
  );
}
