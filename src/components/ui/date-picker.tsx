import { DatePicker as HerouiDatePicker } from "@heroui/date-picker";
import { extendVariants } from "@heroui/system";

export const DatePicker = extendVariants(HerouiDatePicker, {
  variants: {
    size: {
      xs: {
        inputWrapper: "h-8 min-h-8 shadow-none px-2",
        input: "text-tiny",
        label: "text-tiny",
      },
      sm: {
        inputWrapper: "h-8 min-h-8 shadow-none px-3",
        input: "text-small",
        label: "text-small",
      },
      md: {
        inputWrapper: "h-9 min-h-9 shadow-none px-3",
        input: "text-small",
        label: "text-small",
      },
      lg: {
        inputWrapper: "h-10 min-h-10 shadow-none px-3",
        input: "text-small",
        label: "text-small",
      },
    },
    variant: {
      bordered: {
        inputWrapper: "border-small",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
}) as typeof HerouiDatePicker;

export default DatePicker;
