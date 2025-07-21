import { useQuery } from "@apollo/client";
import { Spinner } from "@heroui/spinner";
import {
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { useQueryState } from "nuqs";
import { Link } from "react-router";
import { twMerge } from "tailwind-merge";
import { useDebounce } from "use-debounce";
import { z } from "zod";

import {
  TEACHERS_QUERY,
  TOTAL_TEACHERS_QUERY,
} from "../services/teachersQuery";

import { PageWrapper, SearchIcon } from "@/components";
import { title } from "@/components/primitives";
import { Button, Input } from "@/components/ui";
import Pagination from "@/components/ui/pagination";
import { DEFAULT_ROW_STYLES, Table } from "@/components/ui/table";
import { usePagination } from "@/core/hooks/usePagination";
import { getSerialNumber } from "@/core/utils/pagination";
import type {
  TeachersQueryInput,
  TeachersQueryResponse,
  TotalTeachersQueryResponse,
} from "../services/types";

const columns = [
  { name: "S.No", uid: "id" },
  { name: "Teacher Name", uid: "name" },
  { name: "Email", uid: "email" },
  { name: "Contact Number", uid: "contactNumber" },
  { name: "Grade/Year & Section", uid: "year" },
  { name: "Action", uid: "action" },
];

export default function TeachersPage() {
  const { limit, page, offset, updateSearchParams } = usePagination();
  const [name, setName] = useQueryState("name", z.string().nullable());
  const [debouncedName] = useDebounce(name, 300);
  const { data, loading } = useQuery<TeachersQueryResponse, TeachersQueryInput>(
    TEACHERS_QUERY,
    {
      variables: {
        limit,
        offset,
        ...(debouncedName && { name: debouncedName }),
      },
    },
  );

  const { data: total } = useQuery<
    TotalTeachersQueryResponse,
    TeachersQueryInput
  >(TOTAL_TEACHERS_QUERY, {
    variables: {
      limit,
      offset,
      ...(debouncedName && { name: debouncedName }),
    },
  });

  const teachers = data?.teachers || [];
  const totalTeachers = total?.totalTeachers || 0;

  //TABLE LOADING STATE
  const loadingState = loading ? "loading" : "idle";

  //SEARCH HANDLER
  const handleSearch = (value: string) => {
    setName(value !== "" ? value : null);
    updateSearchParams({ page: 1 });
  };

  //CLEAR SEARCH HANDLER
  const handleClear = () => setName(null);

  return (
    <PageWrapper
      slots={{
        title: "Teachers",
        actions: [
          <Button as={Link} color="secondary" to="create">
            Add Teacher
          </Button>,
        ],
      }}
    >
      <Table
        aria-label="Teachers table"
        bottomContent={<Pagination totalCount={totalTeachers} />}
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
              align={["action"].includes(column.uid) ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={"No students found"}
          loadingContent={<Spinner />}
          loadingState={loadingState}
        >
          {teachers?.map((teacher, i) => {
            const slNo = getSerialNumber(i, page, limit);

            return (
              <TableRow
                key={teacher?.id}
                className={twMerge(DEFAULT_ROW_STYLES)}
              >
                <TableCell>{slNo}</TableCell>
                <TableCell>{teacher?.name}</TableCell>
                <TableCell>{teacher?.email}</TableCell>
                <TableCell>{teacher?.contactNumber}</TableCell>
                <TableCell>
                  {teacher?.grades
                    ?.map(
                      (grade) =>
                        `${grade.grade.grade} - ${grade?.sections?.map((section) => section.section.section).join("")}`,
                    )
                    .join(", ")}
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex items-center justify-center">
                    <Button
                      isIconOnly
                      radius="full"
                      size="sm"
                      variant="light"
                      className="action-btn"
                      as={Link}
                      to={`${teacher?.id}/update`}
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
                      // to={school?.id}
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
    </PageWrapper>
  );
}

export const TopContent = ({
  handleClear,
  handleSearch,
  value,
}: {
  handleSearch: (val: string) => void;
  handleClear: () => void;
  value: string | null;
}) => {
  return (
    <div className="flex items-center gap-4">
      <h1 className={title({ size: "sm", className: "font-bold" })}>
        Teachers
      </h1>
      <Input
        className="ms-auto max-w-xs min-w-44"
        classNames={{
          inputWrapper:
            "group-data-[hover=true]:bg-white group-data-[focus=true]:bg-white shadow-none bg-[#BFBFBF33] ",
        }}
        placeholder="Search"
        radius="full"
        startContent={<SearchIcon />}
        value={value ?? ""}
        onClear={handleClear}
        onValueChange={handleSearch}
      />
      <Button
        className="bg-white"
        endContent={
          <svg
            fill="none"
            height="16"
            viewBox="0 0 16 16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.5 8C12.5 8.13261 12.4473 8.25979 12.3536 8.35355C12.2598 8.44732 12.1326 8.5 12 8.5H4C3.86739 8.5 3.74021 8.44732 3.64645 8.35355C3.55268 8.25979 3.5 8.13261 3.5 8C3.5 7.86739 3.55268 7.74021 3.64645 7.64645C3.74021 7.55268 3.86739 7.5 4 7.5H12C12.1326 7.5 12.2598 7.55268 12.3536 7.64645C12.4473 7.74021 12.5 7.86739 12.5 8ZM14.5 4.5H1.5C1.36739 4.5 1.24021 4.55268 1.14645 4.64645C1.05268 4.74021 1 4.86739 1 5C1 5.13261 1.05268 5.25979 1.14645 5.35355C1.24021 5.44732 1.36739 5.5 1.5 5.5H14.5C14.6326 5.5 14.7598 5.44732 14.8536 5.35355C14.9473 5.25979 15 5.13261 15 5C15 4.86739 14.9473 4.74021 14.8536 4.64645C14.7598 4.55268 14.6326 4.5 14.5 4.5ZM9.5 10.5H6.5C6.36739 10.5 6.24021 10.5527 6.14645 10.6464C6.05268 10.7402 6 10.8674 6 11C6 11.1326 6.05268 11.2598 6.14645 11.3536C6.24021 11.4473 6.36739 11.5 6.5 11.5H9.5C9.63261 11.5 9.75979 11.4473 9.85355 11.3536C9.94732 11.2598 10 11.1326 10 11C10 10.8674 9.94732 10.7402 9.85355 10.6464C9.75979 10.5527 9.63261 10.5 9.5 10.5Z"
              fill="#1C1C1C"
            />
          </svg>
        }
        radius="full"
        variant="bordered"
      >
        Filter
      </Button>
    </div>
  );
};
