import { Card } from "@heroui/card";
import { CircularProgress } from "@heroui/progress";

type IECCardProps = {
  bgColor?: string;
};

export default function IECCard({
  bgColor = "var(--sidebar-bg)",
}: IECCardProps) {
  return (
    <Card aria-label="IEC Card" classNames={{ base: "shadow-none" }}>
      <div
        className="flex h-full w-full flex-col justify-between p-3"
        style={{ background: bgColor }}
      >
        <div className="flex w-full items-center justify-around">
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
        <p className="text-center text-xs text-[#303030]">Average Score</p>
      </div>
    </Card>
  );
}
