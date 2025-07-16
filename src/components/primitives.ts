import { tv } from "tailwind-variants";

export const title = tv({
  base: "inline text-primary",
  variants: {
    size: {
      sm: "text-base lg:text-xl",
      md: "text-xl lg:text-2xl",
      lg: "text-2xl lg:text-3xl",
    },
    fullWidth: {
      true: "w-full block",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const subtitle = tv({
  base: "my-2 text-lg lg:text-xl text-primary block w-full max-w-full md:w-1/2",
  variants: {
    fullWidth: {
      true: "!w-full",
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
});
