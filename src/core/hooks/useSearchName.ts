import { useQueryState } from "nuqs";
import { useDebounce } from "use-debounce";
import { z } from "zod";
import { usePagination } from "./usePagination";

export const useSearchName = (debounceMs: number = 300) => {
  const { updateSearchParams } = usePagination();
  const [name, setName] = useQueryState("name", z.string().nullable());
  const [debouncedName] = useDebounce(name, debounceMs);

  const handleSearch = (value: string) => {
    setName(value !== "" ? value : null);
    updateSearchParams({ page: 1 });
  };

  const handleClear = () => {
    setName(null);
    updateSearchParams({ page: 1 });
  };

  return {
    name,
    debouncedName,
    handleSearch,
    handleClear,
    setName,
  };
};

// Usage in your component:
// const { limit, offset, page, updateSearchParams } = usePagination();
// const { name, debouncedName, handleSearch, handleClear } = useSearchName({
//   updateSearchParams
// });
