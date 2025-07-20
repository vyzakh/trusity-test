import { useQuery } from "@apollo/client";
import { Image } from "@heroui/image";
import { CircularProgress } from "@heroui/progress";
import { Spinner } from "@heroui/spinner";
import {
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Link } from "react-router";
import { twMerge } from "tailwind-merge";

import { SCHOOLS_QUERY, TOTAL_SCHOOLS_QUERY } from "../services/schoolQueries";

import { NA } from "@/components";
import { Button } from "@/components/ui";
import Pagination from "@/components/ui/pagination";
import { DEFAULT_ROW_STYLES, Table } from "@/components/ui/table";
import { usePagination } from "@/core/hooks/usePagination";
import { useSearchName } from "@/core/hooks/useSearchName";
import { getSerialNumber } from "@/core/utils/pagination";
import type {
  SchoolsInput,
  SchoolsQueryResponse,
  TotalSchoolsQueryResponse,
} from "../services/types";
import TopContent from "./TopContent";

const columns = [
  { name: "S.No", uid: "id" },
  { name: "", uid: "logo" },
  { name: "School Name", uid: "school" },
  { name: "Email", uid: "email" },
  { name: "No.of Licences", uid: "licences" },
  { name: "No.of Teacher", uid: "teachers" },
  { name: "No.of Students", uid: "students" },
  { name: "In progress", uid: "i" },
  { name: "Completed", uid: "e" },
  { name: "Action", uid: "action" },
];

export default function SchoolsTable() {
  const { limit, offset, page } = usePagination();
  const { debouncedName, handleClear, handleSearch, name } = useSearchName();

  //SCHOOL LIST QUERY
  const { data, loading } = useQuery<SchoolsQueryResponse, SchoolsInput>(
    SCHOOLS_QUERY,
    {
      variables: {
        limit,
        offset,
        ...(debouncedName && { name: debouncedName }),
      },
    },
  );

  //TOTAL SCHOOLS QUERY
  const { data: total } = useQuery<TotalSchoolsQueryResponse, SchoolsInput>(
    TOTAL_SCHOOLS_QUERY,
    {
      variables: {
        ...(debouncedName && { name: debouncedName }),
      },
    },
  );

  const schools = data?.schools || [];
  const totalSchools = total?.totalSchools || 0;

  //TABLE LOADING STATE
  const loadingState = loading ? "loading" : "idle";

  return (
    <Table
      aria-label="Schools table"
      bottomContent={<Pagination totalCount={totalSchools} />}
      bottomContentPlacement="outside"
      topContent={
        <TopContent
          handleClear={handleClear}
          handleSearch={handleSearch}
          value={name}
        />
      }
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={
              [
                "action",
                "email",
                "licences",
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
      <TableBody
        emptyContent={"No schools found"}
        loadingContent={<Spinner />}
        loadingState={loadingState}
      >
        {schools?.map((school, i) => {
          const slNo = getSerialNumber(i, page, limit);

          return (
            <TableRow key={school?.id} className={twMerge(DEFAULT_ROW_STYLES)}>
              <TableCell>{slNo}</TableCell>
              <TableCell className="p-0">
                <Image
                  className="size-8 object-contain group-hover:bg-white"
                  radius="none"
                  src={school.logoUrl ?? "/logo.png"}
                />
              </TableCell>
              <TableCell>
                <p className="line-clamp-2 max-w-44">{school?.name}</p>
              </TableCell>
              <TableCell>
                <p className="max-w-44 truncate text-center">
                  {school?.contact?.email ?? <NA />}
                </p>
              </TableCell>
              <TableCell className="text-center">
                {school?.license?.totalLicense}
              </TableCell>
              <TableCell className="text-center">
                {school?.stats?.totalTeachers}
              </TableCell>
              <TableCell className="text-center">
                {school?.stats?.totalStudents}
              </TableCell>
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
                    value={50}
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
                    value={60}
                  />
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center">
                  <Button
                    isIconOnly
                    as={Link}
                    className="action-btn"
                    radius="full"
                    size="sm"
                    state={{ from: "/schools" }}
                    to={`${school.id}/update`}
                    variant="light"
                  >
                    <svg
                      fill="none"
                      height="16"
                      viewBox="0 0 17 16"
                      width="17"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        className="group-hover:fill-white"
                        d="M14.7069 4.58561L11.9144 1.79249C11.8215 1.6996 11.7113 1.62592 11.5899 1.57565C11.4686 1.52539 11.3385 1.49951 11.2072 1.49951C11.0759 1.49951 10.9458 1.52539 10.8245 1.57565C10.7031 1.62592 10.5929 1.6996 10.5 1.79249L2.79313 9.49999C2.69987 9.59251 2.62593 9.70265 2.5756 9.824C2.52528 9.94535 2.49959 10.0755 2.50001 10.2069V13C2.50001 13.2652 2.60536 13.5196 2.7929 13.7071C2.98043 13.8946 3.23479 14 3.50001 14H6.29313C6.4245 14.0004 6.55464 13.9747 6.67599 13.9244C6.79735 13.8741 6.90748 13.8001 7.00001 13.7069L14.7069 5.99999C14.7998 5.90712 14.8734 5.79687 14.9237 5.67553C14.974 5.55419 14.9999 5.42414 14.9999 5.2928C14.9999 5.16146 14.974 5.0314 14.9237 4.91006C14.8734 4.78872 14.7998 4.67847 14.7069 4.58561ZM6.29313 13H3.50001V10.2069L9.00001 4.70686L11.7931 7.49999L6.29313 13ZM12.5 6.79249L9.70688 3.99999L11.2069 2.49999L14 5.29249L12.5 6.79249Z"
                        fill="#595959"
                      />
                    </svg>
                  </Button>
                  <Button
                    as={Link}
                    className="action-btn min-w-min px-3 group-hover:text-[#4F78FB]"
                    size="sm"
                    to={school?.id}
                    variant="light"
                  >
                    View
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
