import { Pagination as HeroUIPAgination } from "@heroui/pagination";
import { SelectItem } from "@heroui/select";

import Select from "./select";

import { usePagination } from "@/core/hooks/usePagination";
import type { SharedSelection } from "@heroui/system";

type PaginationProps = {
  totalCount: number;
};

const Pagination = ({ totalCount }: PaginationProps) => {
  const { page, totalPages, updateSearchParams, limit } =
    usePagination(totalCount);

  if (totalCount === 0) {
    return null;
  }

  const handleChangePageSize = (selectedKey: SharedSelection) => {
    const [rawValue] = Array.from(selectedKey);

    const newSize = parseInt(rawValue as string, 10);

    if (Number.isFinite(newSize)) {
      updateSearchParams({ page: 1, size: newSize });
    }
  };

  const handleChangePage = (page: number) => {
    if (Number.isFinite(page)) {
      updateSearchParams({ page });
    }
  };

  return (
    <div className="flex flex-1 flex-wrap items-center justify-between gap-1 gap-y-4 pt-3">
      <div className="flex items-center gap-1">
        <Select
          aria-label="Page Size"
          className="w-16 shrink-0"
          classNames={{
            popoverContent: "p-0",
            trigger: "bg-transparent shadow-none",
          }}
          defaultSelectedKeys={["10"]}
          selectedKeys={[String(limit)]}
          selectorIcon={
            <svg
              fill="none"
              height="16"
              viewBox="0 0 16 16"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.6464 6.34033C11.8417 6.55323 12.1583 6.55323 12.3536 6.34033C12.5488 6.12743 12.5488 5.78225 12.3536 5.56935L9.06066 1.97902C8.47487 1.34032 7.52513 1.34033 6.93934 1.97902L3.64645 5.56935C3.45118 5.78225 3.45118 6.12743 3.64645 6.34032C3.84171 6.55322 4.15829 6.55322 4.35355 6.34032L7.64645 2.75C7.84171 2.5371 8.15829 2.5371 8.35355 2.75L11.6464 6.34033Z"
                fill="#1C1C1C"
                fillOpacity="0.4"
              />
              <path
                d="M4.35355 9.65968C4.15829 9.44678 3.84171 9.44678 3.64645 9.65968C3.45118 9.87257 3.45118 10.2178 3.64645 10.4307L6.93934 14.021C7.52513 14.6597 8.47487 14.6597 9.06066 14.021L12.3536 10.4307C12.5488 10.2178 12.5488 9.87258 12.3536 9.65968C12.1583 9.44678 11.8417 9.44678 11.6464 9.65968L8.35355 13.25C8.15829 13.4629 7.84171 13.4629 7.64645 13.25L4.35355 9.65968Z"
                fill="#1C1C1C"
                fillOpacity="0.4"
              />
            </svg>
          }
          size="sm"
          onSelectionChange={handleChangePageSize}
        >
          <SelectItem key="10">10</SelectItem>
          <SelectItem key="20">20</SelectItem>
          <SelectItem key="30">30</SelectItem>
        </Select>
        <p className="text-sm whitespace-nowrap text-black/40">
          {totalCount} results
        </p>
      </div>
      <HeroUIPAgination
        showControls
        page={page}
        siblings={1}
        total={totalPages}
        onChange={handleChangePage}
      />
    </div>
  );
};

export default Pagination;
