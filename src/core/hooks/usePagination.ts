import { useQueryStates } from "nuqs";
import { z } from "zod";

type PaginationProps = number | string;

export const usePagination = (totalCount: PaginationProps = 0) => {
  const [{ size, page }, setQuery] = useQueryStates(
    {
      page: z.coerce.number().int().min(1).default(1),
      size: z.coerce.number().int().min(1).default(10),
    },
    { history: "push", clearOnDefault: true },
  );

  const limit = size ?? 10;
  const currentPage = page ?? 1;
  const totalPages = Math.ceil(Number(totalCount) / limit);
  const offset = (currentPage - 1) * limit;

  return {
    limit,
    offset,
    page: currentPage,
    totalPages,
    updateSearchParams: setQuery,
  };
};
