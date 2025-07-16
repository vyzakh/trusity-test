import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui";

export default function Section({
  section,
  delay,
  handleChangeSection,
  selected,
}: {
  section: { section: string; id: number };
  delay: number;
  selected: boolean;
  handleChangeSection: (value: number) => void;
}) {
  return (
    <motion.label
      key={section.id}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-min cursor-pointer"
      htmlFor={section.section}
      initial={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3, delay }}
    >
      <input
        checked={selected}
        className="peer sr-only"
        id={section.section}
        type="checkbox"
        onChange={() => handleChangeSection(section.id)}
      />

      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -right-1 -top-1 z-[999] rounded-md bg-primary p-0.5"
            exit={{ scale: 0, opacity: 0 }}
            initial={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <svg
              key={section.id}
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
        className="relative size-10 min-w-0 p-0 px-0 peer-checked:border-primary"
        radius="sm"
        variant="bordered"
      >
        {section.section}
      </Button>
    </motion.label>
  );
}
