import { useQueryState, parseAsString } from "nuqs";
import { useDebounce } from "use-debounce";
import { usePagination } from "./usePagination";

export const useSearchName = (debounceMs: number = 300) => {
  const { updateSearchParams } = usePagination();
  const [name, setName] = useQueryState("name", parseAsString); 
  const [debouncedName] = useDebounce(name, debounceMs);

  const handleSearch = (value: string) => {
    setName(value !== "" ? value : "");
    updateSearchParams({ page: 1 });
  };

  const handleClear = () => {
    setName("");
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
