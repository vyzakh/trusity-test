import { Select as HerouiSelect } from "@heroui/select";
import { extendVariants } from "@heroui/system";

export const Select = extendVariants(HerouiSelect, {
  variants: {
    size: {
      xs: {
        trigger: "shadow-none min-h-8 h-8 text-tiny px-2",
        value: "text-tiny",
        listbox: "text-tiny",
      },
      sm: {
        trigger: "shadow-none min-h-8 h-8 text-small px-3",
        value: "text-small",
        listbox: "text-small",
      },
      md: {
        trigger: "shadow-none min-h-9 h-9 text-small px-3",
        value: "text-small",
        listbox: "text-small",
      },
      lg: {
        trigger: "shadow-none min-h-10 h-10 text-medium px-4",
        value: "text-medium",
        listbox: "text-medium",
      },
    },
    variant: {
      bordered: {
        trigger: "border-small",
      },
    },
  },
  defaultVariants: {
    size: "md",
    labelPlacement: "outside",
    placeholder: "Select",
  },
});

export default Select as typeof HerouiSelect;
