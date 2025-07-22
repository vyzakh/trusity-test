import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui";
import { useCheckbox, type CheckboxProps } from "@heroui/checkbox";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { twMerge } from "tailwind-merge";

type SectionProps = CheckboxProps & {
  delay: number;
};

export default function Section({ delay, ...props }: SectionProps) {
  const { children, isSelected, getInputProps, isFocusVisible } = useCheckbox({
    ...props,
  });

  return (
    <motion.label
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-min cursor-pointer"
      initial={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3, delay }}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>

      <AnimatePresence mode="wait">
        {isSelected && (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="bg-primary absolute -top-1 -right-1 z-[999] rounded-md p-0.5"
            exit={{ scale: 0, opacity: 0 }}
            initial={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <svg
              className="size-4 shrink-0 stroke-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <motion.path
                animate={{ pathLength: 1 }}
                d="M5 13l4 4L19 7"
                exit={{ pathLength: 0 }}
                initial={{ pathLength: 0 }}
                strokeLinecap="round"
                strokeLinejoin="round"
                transition={{
                  delay: 0.2,
                  type: "tween",
                  ease: "easeOut",
                  duration: 0.3,
                }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        as="span"
        className={twMerge(
          "relative size-10 min-w-0 p-0 px-0",
          (isFocusVisible || isSelected) && "border-primary",
          props.isInvalid && "border-danger text-danger",
        )}
        radius="sm"
        variant="bordered"
      >
        {children}
      </Button>
    </motion.label>
  );
}
