import { Image } from "@heroui/image";
import { CircularProgress } from "@heroui/progress";
import {
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Link } from "react-router";
import { twMerge } from "tailwind-merge";

import { SearchIcon } from "@/components";
import { title } from "@/components/primitives";
import { Button, Input } from "@/components/ui";
import { DEFAULT_ROW_STYLES, Table } from "@/components/ui/table";
import { schools } from "@/core/utils/dummyData";

const columns = [
  { name: "S.No", uid: "id" },
  { name: "", uid: "logo" },
  { name: "School Name", uid: "school" },
  { name: "Email", uid: "email" },
  { name: "No.of License", uid: "licenses" },
  { name: "No.of Teacher", uid: "teachers" },
  { name: "Active Students", uid: "students" },
  { name: "I", uid: "i" },
  { name: "E", uid: "e" },
  { name: "C", uid: "c" },
  { name: "Action", uid: "action" },
];

export default function SchoolTable() {
  return (
    <Table aria-label="Schools table" topContent={TopContent()}>
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={
              [
                "action",
                "licenses",
                "teachers",
                "students",
                "i",
                "e",
                "c",
              ].includes(column.uid)
                ? "center"
                : "start"
            }
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No users found"}>
        {schools?.map((school) => (
          <TableRow key={school.id} className={twMerge(DEFAULT_ROW_STYLES)}>
            <TableCell>{school.id}</TableCell>
            <TableCell className="p-0">
              <Image className="size-8" src="/school-logo.png" />
            </TableCell>
            <TableCell>{school.name}</TableCell>
            <TableCell>{school.email}</TableCell>
            <TableCell className="text-center">{school.licenses}</TableCell>
            <TableCell className="text-center">{school.teachers}</TableCell>
            <TableCell className="text-center">{school.students}</TableCell>
            <TableCell>
              <div className="flex h-full w-full items-center justify-center">
                <CircularProgress
                  showValueLabel
                  aria-label="I progress"
                  classNames={{
                    value: "text-xs",
                    indicator: "stroke-[#F79333]",
                    track: "stroke-[#F793334D]",
                  }}
                  formatOptions={{ style: "decimal" }}
                  strokeWidth={4}
                  value={school.i}
                />
              </div>
            </TableCell>
            <TableCell>
              <div className="flex h-full w-full items-center justify-center">
                <CircularProgress
                  showValueLabel
                  aria-label="E progress"
                  classNames={{
                    value: "text-xs",
                    indicator: "stroke-[#3EC7F4]",
                    track: "stroke-[#3EC7F44D]",
                  }}
                  formatOptions={{ style: "decimal" }}
                  strokeWidth={4}
                  value={school.e}
                />
              </div>
            </TableCell>
            <TableCell>
              <div className="flex h-full w-full items-center justify-center">
                <CircularProgress
                  showValueLabel
                  aria-label="C progress"
                  classNames={{
                    value: "text-xs",
                    indicator: "stroke-[#4F78FB]",
                    track: "stroke-[#C4D0F8]",
                  }}
                  formatOptions={{ style: "decimal" }}
                  strokeWidth={4}
                  value={school.c}
                />
              </div>
            </TableCell>
            <TableCell className="text-center">
              <Button
                className="data-[hover=true]:bg-default/20 min-w-min px-3 group-hover:text-[#4F78FB]"
                size="sm"
                variant="light"
              >
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export const TopContent = () => {
  return (
    <div className="flex items-center gap-4">
      <h1 className={twMerge(title({ size: "lg" }), "text-[#343434]")}>
        Schools
      </h1>

      <Input
        className="ml-auto max-w-xs min-w-44"
        classNames={{
          inputWrapper:
            "group-data-[hover=true]:bg-white group-data-[focus=true]:bg-white shadow-none bg-[#BFBFBF33]",
        }}
        placeholder="Search"
        startContent={<SearchIcon />}
      />
      <Button as={Link} to="#" variant="light">
        View All
      </Button>
    </div>
  );
};
