import { Button as HeroUIButton, type ButtonProps } from "@heroui/button";
import { extendVariants } from "@heroui/system";

const Button = extendVariants(HeroUIButton, {
  variants: {
    size: {
      xs: "px-2 min-w-12 h-8 text-tiny gap-1 rounded-small",
      sm: "px-3 min-w-16 h-8 text-tiny gap-1.5 rounded-small",
      md: "px-4 min-w-20 h-9 text-small gap-2 rounded-medium",
      lg: "px-4 min-w-20 h-10 text-small gap-2.5 rounded-medium",
    },
    variant: {
      bordered: "border-1",
    },
    radius: {
      full: "rounded-full",
    },
    isIconOnly: {
      true: "min-w-0 px-0",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export default Button as typeof HeroUIButton & {
  (props: ButtonProps & { isIconOnly?: boolean }): React.ReactElement;
};
