import { Checkbox as HerouiCheckbox } from "@heroui/checkbox";
import { extendVariants } from "@heroui/system";

export const CheckBox = extendVariants(HerouiCheckbox, {
  variants: {
    size: {
      md: { label: "text-sm" },
    },
  },
}) as typeof HerouiCheckbox;

export default CheckBox;
