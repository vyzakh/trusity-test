import { useQuery } from "@apollo/client";
import { AutocompleteItem } from "@heroui/autocomplete";
import { Form } from "@heroui/form";
import { SelectItem } from "@heroui/select";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { SearchIcon } from "@/components";
import { title } from "@/components/primitives";
import { Autocomplete, Button, Input, Select } from "@/components/ui";
import { emptyStringToNull } from "@/core/utils/string";
import { GRADES_AND_SECTIONS_QUERY } from "@/features/school/pages/grades/services/gradeQueries";
import type { GradesAndSectionsQueryResponse } from "@/features/school/pages/grades/services/types";
import type { StudentFilterSchemaType } from "@/features/school/pages/students/schemas/studentFilterSchema";

type TopContentProps = {
  handleSearch: (val: string) => void;
  handleClear: () => void;
  value: string | null;
  handleFilter: (filters: StudentFilterSchemaType) => void;
  filters: StudentFilterSchemaType;
};

const TopContent = ({
  handleClear,
  handleSearch,
  value,
  handleFilter,
  filters,
}: TopContentProps) => {
  const [openFilter, setOpenFilter] = React.useState(false);

  // GET GRADES AND SECTIONS QUERY
  const { data, loading: isLoading } = useQuery<
    GradesAndSectionsQueryResponse,
    { includeSchool: boolean; schoolId: string }
  >(GRADES_AND_SECTIONS_QUERY, {
    variables: { includeSchool: false, schoolId: "" },
  });

  const { control, handleSubmit, reset, setValue } =
    useForm<StudentFilterSchemaType>({
      defaultValues: {
        schoolGradeId: filters?.schoolGradeId || "",
        schoolSectionId: filters?.schoolSectionId || "",
      },
    });

  const grades = data?.grades || [];
  const sections = data?.sections || [];

  const handleSubmitFilter = (data: StudentFilterSchemaType) =>
    handleFilter({
      schoolGradeId: emptyStringToNull(data.schoolGradeId),
      schoolSectionId: emptyStringToNull(data.schoolSectionId),
    });

  const handleOpenFilter = () => setOpenFilter(true);

  //ACTIVATE FILTER IF ALREADY APPLIED
  React.useEffect(() => {
    if (filters) {
      const hasAnyFilter = Object.values(filters).some(
        (val) => val !== null && val !== undefined && val !== "",
      );

      if (hasAnyFilter) {
        setOpenFilter(true);
      }
    }
  }, [filters]);

  //CLEAR FILTER HANDLER
  const handleClearFilter = () => {
    setOpenFilter(false);
    reset({ schoolGradeId: "", schoolSectionId: "" });
    handleFilter({ schoolGradeId: null, schoolSectionId: null });
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-4">
        <h1 className={title({ size: "sm", className: "font-bold" })}>
          Students
        </h1>

        <Input
          className="ml-auto max-w-xs min-w-44"
          classNames={{
            inputWrapper:
              "group-data-[hover=true]:bg-white group-data-[focus=true]:bg-white shadow-none bg-[#BFBFBF33] ",
          }}
          placeholder="Search student name"
          radius="full"
          startContent={<SearchIcon />}
          value={value ?? ""}
          onClear={handleClear}
          onValueChange={handleSearch}
        />
        <Button
          className={twMerge("bg-white", openFilter && "bg-primary text-white")}
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
                fill="currentColor"
              />
            </svg>
          }
          radius="full"
          variant="bordered"
          onPress={handleOpenFilter}
        >
          Filter
        </Button>
      </div>
      <AnimatePresence initial={false} mode="wait">
        {openFilter && (
          <motion.div
            animate={{ height: "auto" }}
            className="overflow-hidden"
            exit={{ height: 0 }}
            initial={{ height: 0 }}
          >
            <Form className="py-5" onSubmit={handleSubmit(handleSubmitFilter)}>
              <div className="w-full rounded-lg bg-white p-5">
                <div className="mb-4 grid w-full gap-3 gap-x-5 gap-y-4 lg:grid-cols-3">
                  <Controller
                    control={control}
                    name="schoolGradeId"
                    render={({ field: { value, ...rest } }) => (
                      <Select
                        {...rest}
                        isLoading={isLoading}
                        label="Grade/Year"
                        labelPlacement="outside"
                        placeholder="Select"
                        selectedKeys={[value || ""]}
                        value=""
                        variant="bordered"
                        onSelectionChange={() =>
                          setValue("schoolSectionId", "")
                        }
                      >
                        {grades?.map((grade) => (
                          <SelectItem key={grade.id} textValue={grade.grade}>
                            {grade.grade}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                  <Controller
                    control={control}
                    name="schoolSectionId"
                    render={({ field }) => (
                      <Autocomplete
                        inputProps={{
                          classNames: {
                            inputWrapper: "border-small shadow-none",
                          },
                        }}
                        isClearable={false}
                        items={sections}
                        label="Section"
                        labelPlacement="outside"
                        name={field.name}
                        placeholder="Select"
                        selectedKey={field.value}
                        variant="bordered"
                        onBlur={field.onBlur}
                        onSelectionChange={(e) => field.onChange(e)}
                      >
                        {(section) => (
                          <AutocompleteItem
                            key={section.id}
                            textValue={section.section}
                          >
                            {section.section}
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    )}
                  />
                </div>
                <div className="flex w-full items-center justify-end gap-2">
                  <Button
                    radius="full"
                    size="sm"
                    variant="bordered"
                    onPress={handleClearFilter}
                  >
                    Cancel
                  </Button>
                  <Button color="primary" radius="full" size="sm" type="submit">
                    Apply Filter
                  </Button>
                </div>
              </div>
            </Form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TopContent;
