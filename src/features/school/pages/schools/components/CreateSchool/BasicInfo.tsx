import { useQuery } from "@apollo/client";
import { SelectItem } from "@heroui/select";
import { DevTool } from "@hookform/devtools";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

import { CURRICULUMS_QUERY } from "../../services/schoolQueries";

import Upload from "./Upload";

import { Input, NumberInput, Select } from "@/components/ui";
import type { SharedSelection } from "@heroui/system";
import type { CreateSchoolSchemaType } from "../../schemas/createSchoolSchema";
import type { CurriculumListResponse } from "../../services/types";

export default function BasicInfo() {
  const { control, setValue } = useFormContext<CreateSchoolSchemaType>();

  //LIST CURRICULUMS QUERY
  const {
    data: curriculums = { curriculums: [] },
    loading: loadingCurriculums,
  } = useQuery<CurriculumListResponse>(CURRICULUMS_QUERY);

  //SLECTED CURRICULUM STATE
  const selectedCurriculums = useWatch({
    control,
    name: "curriculums",
  });

  const hasCustomCurriculum = selectedCurriculums?.some((c) => c.allowCustom);

  //CURRICULUM SELECTION HANDLER
  const onSelectionChange = (keys: SharedSelection) => {
    const selectedKeys = Array.from(keys);
    const selectedCurriculums = curriculums?.curriculums?.filter((c) => {
      return selectedKeys.includes(c.id.toString());
    });

    setValue("curriculums", selectedCurriculums, { shouldValidate: true });
  };

  return (
    <React.Fragment>
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState: { error, invalid } }) => (
          <Input
            {...field}
            isRequired
            errorMessage={error?.message}
            isInvalid={invalid}
            label="School Name"
            labelPlacement="outside"
            placeholder="School name"
            variant="bordered"
          />
        )}
      />

      <Controller
        control={control}
        name="logo"
        render={({ field, fieldState: { invalid } }) => (
          <Upload
            isRequired
            allowedFormats={["image/png", "image/jpeg", "image/jpg"]}
            errorMessage="School logo is required"
            file={field.value}
            fileType="SCHOOL_LOGO"
            isInvalid={invalid}
            label="Logo"
            onDelete={() => field.onChange({})}
            onUploadComplete={(data) => field.onChange(data)}
          />
        )}
      />

      <div className="grid w-full place-items-start gap-x-2 gap-y-5 lg:grid-cols-2">
        <div className="flex w-full flex-col gap-y-5">
          <Controller
            control={control}
            name="curriculums"
            render={({ field, fieldState: { invalid, error } }) => (
              <Select
                isRequired
                errorMessage={error?.message}
                isInvalid={invalid}
                isLoading={loadingCurriculums}
                label="Curicculum"
                labelPlacement="outside"
                placeholder=" "
                selectedKeys={field.value?.map((c) => c.id.toString())}
                selectionMode="multiple"
                variant="bordered"
                onBlur={field.onBlur}
                onSelectionChange={onSelectionChange}
              >
                {curriculums?.curriculums?.map((c) => (
                  <SelectItem key={c.id} textValue={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
          <AnimatePresence mode="wait">
            {hasCustomCurriculum && (
              <motion.div
                key="custom-curriculum"
                animate={{ marginTop: 0, opacity: 1 }}
                exit={{ marginTop: "-10px", opacity: 0 }}
                initial={{ marginTop: "-10px", opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Controller
                  control={control}
                  name="customCurriculum"
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Input
                      {...field}
                      isRequired
                      errorMessage={error?.message}
                      isInvalid={invalid}
                      label="Custom curriculum name"
                      labelPlacement="outside"
                      placeholder="Enter your custom curriculum name"
                      variant="bordered"
                    />
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Controller
          control={control}
          name="totalLicense"
          render={({ field, fieldState: { error, invalid } }) => (
            <NumberInput
              {...field}
              value={field.value}
              isRequired
              errorMessage={error?.message}
              isInvalid={invalid}
              label="Number of licences"
              variant="bordered"
              placeholder=" "
              formatOptions={{
                useGrouping: false,
              }}
              onChange={() => {}}
              onValueChange={(val) => field.onChange(val)}
              isWheelDisabled
              hideStepper
            />
          )}
        />
      </div>
      <DevTool control={control} />
    </React.Fragment>
  );
}
