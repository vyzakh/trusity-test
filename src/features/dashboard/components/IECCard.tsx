import { Card } from "@heroui/card";
import { CircularProgress } from "@heroui/progress";
import { motion } from "framer-motion";

import SvgColor from "@/components/svg-color";

export default function IECCard() {
  return (
    <Card
      aria-label="IEC Card"
      className="md:col-span-2"
      classNames={{ base: "shadow-none" }}
    >
      <div
        className="flex h-full w-full flex-col justify-between p-5 lg:px-8"
        style={{ background: "var(--sidebar-bg)" }}
      >
        <div className="flex w-full items-center justify-between gap-5 md:gap-16">
          <div className="flex flex-col items-center justify-center">
            <div className="grid place-items-center rounded-full bg-white/50 p-3 text-black">
              <motion.div
                animate={{ y: 0 }}
                className="grid size-8 place-items-center"
                initial={{ y: -50 }}
              >
                <SvgColor
                  src={`/icons/dashboard/card/ChartLine.svg`}
                  style={{ width: "30px", height: "30px" }}
                />
              </motion.div>
            </div>
            <p className="text-center text-sm text-[#303030]">Average Score</p>
          </div>
          <div className="flex flex-1 items-center justify-around">
            <div className="flex flex-col items-center gap-1">
              <p className="text-sm">I</p>
              <CircularProgress
                aria-label="I progress"
                classNames={{
                  svg: "size-16",
                  value: "text-lg",
                  indicator: "stroke-[#3EC7F4] rounded-none",
                  track: "stroke-[#3EC7F44D] rounded-none",
                }}
                formatOptions={{ style: "decimal" }}
                showValueLabel={true}
                strokeWidth={4}
                value={20}
              />
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-sm">E</p>
              <CircularProgress
                aria-label="E progress"
                classNames={{
                  svg: "size-16",
                  value: "text-lg",
                  indicator: "stroke-[#F79333]",
                  track: "stroke-[#F793334D]",
                }}
                formatOptions={{ style: "decimal" }}
                showValueLabel={true}
                strokeWidth={4}
                value={70}
              />
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-sm">C</p>
              <CircularProgress
                aria-label="C progress"
                classNames={{
                  svg: "size-16",
                  value: "text-lg",
                  indicator: "stroke-[#4F78FB]",
                  track: "stroke-[#4F78FB4D]",
                }}
                formatOptions={{ style: "decimal" }}
                showValueLabel={true}
                strokeWidth={4}
                value={40}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
