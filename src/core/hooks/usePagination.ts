import { useQueryStates, parseAsInteger } from "nuqs";
type PaginationProps = number | string;

export const usePagination = (totalCount: PaginationProps = 0) => {
  const [{ size, page }, setQuery] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      size: parseAsInteger.withDefault(10),

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
