import { Textarea as HerouiTextArea } from "@heroui/input";
import { extendVariants } from "@heroui/system";

export const Textarea = extendVariants(HerouiTextArea, {
  variants: {
    size: {
      xs: {
        inputWrapper: "shadow-none py-2 px-2",
        input: "text-tiny",
        label: "text-tiny",
      },
      sm: {
        inputWrapper: "shadow-none py-2 px-3",
        input: "text-small",
        label: "text-small",
      },
      md: {
        inputWrapper: "shadow-none py-2 px-3",
        input: "text-small",
        label: "text-small",
      },
      lg: {
        inputWrapper: "shadow-none py-2 px-3",
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
    variant: "bordered",
    labelPlacement: "outside-top",
  },
}) as typeof HerouiTextArea;

export default Textarea;
