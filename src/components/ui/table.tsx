import { Table as HeroUITable, type TableProps } from "@heroui/table";
import { twMerge } from "tailwind-merge";

export const Table: React.FC<TableProps> = ({
  className,
  classNames,
  ...rest
}) => {
  return (
    <HeroUITable
      {...rest}
      className={className}
      classNames={{
        wrapper: twMerge(
          "rounded-xl bg-[#F6F6F6] shadow-none p-5",
          classNames?.wrapper,
        ),
        th: twMerge("bg-transparent text-xs font-normal", classNames?.th),
        tr: twMerge("h-10 transition-colors duration-200", classNames?.tr),
        table: twMerge("border-separate border-spacing-y-1", classNames?.table),
        tbody: "relative",
        td: [
          "first:rounded-s-lg",
          "last:rounded-e-lg",
          "group-hover:bg-primary bg-[#F7F9FB]",
          ...(Array.isArray(classNames?.td) ? classNames.td : []),
        ],
      }}
    />
  );
};

export const DEFAULT_ROW_STYLES = "group hover:text-[#F7F9FB]";
