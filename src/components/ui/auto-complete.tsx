import {
  Autocomplete as HerouiAutocomplete,
  type AutocompleteProps,
} from "@heroui/autocomplete";
import React from "react";
import { twMerge } from "tailwind-merge";

const Autocomplete: React.FC<AutocompleteProps> = ({
  labelPlacement = "outside",
  variant = "bordered",
  ...props
}) => {
  return (
    <HerouiAutocomplete
      {...props}
      inputProps={{
        classNames: {
          inputWrapper: twMerge(
            "border-small shadow-none",
            props.size === "sm"
              ? "h-8 min-h-8"
              : props?.size === "lg"
                ? "h-10 min-h-10"
                : "h-9 min-h-9",
          ),
        },
      }}
      labelPlacement={labelPlacement}
      variant={variant}
    />
  );
};

export default Autocomplete as typeof HerouiAutocomplete;
