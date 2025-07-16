"use client";

import type { ComponentProps } from "react";

import { type ButtonProps } from "@heroui/button";
import { cn } from "@heroui/theme";
import { useControlledState } from "@react-stately/utils";
import { LazyMotion, domAnimation, m } from "framer-motion";
import React from "react";
import { twMerge } from "tailwind-merge";

import { Button } from "@/components/ui";

export type RowStepProps = {
  title?: React.ReactNode;
  className?: string;
};

export interface RowStepsProps extends React.HTMLAttributes<HTMLButtonElement> {
  steps?: RowStepProps[];

  color?: ButtonProps["color"];

  currentStep?: number;

  defaultStep?: number;

  hideProgressBars?: boolean;

  className?: string;

  stepClassName?: string;

  onStepChange?: (stepIndex: number) => void;

  variant?: "default" | "filled";
  size?: "sm" | "md" | "lg";
}

function CheckIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <m.path
        animate={{ pathLength: 1 }}
        d="M5 13l4 4L19 7"
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
  );
}

const RowSteps = React.forwardRef<HTMLButtonElement, RowStepsProps>(
  (
    {
      color = "primary",
      steps = [],
      defaultStep = 0,
      onStepChange,
      currentStep: currentStepProp,
      hideProgressBars = false,
      stepClassName,
      className,
      variant = "default",
      size = "md",
    },
    ref,
  ) => {
    const [currentStep, setCurrentStep] = useControlledState(
      currentStepProp,
      defaultStep,
      onStepChange,
    );

    const colors = React.useMemo(() => {
      let userColor;
      let fgColor;

      const colorsVars = [
        "[--active-fg-color:var(--step-fg-color)]",
        "[--active-border-color:var(--step-color)]",
        "[--active-color:var(--step-color)]",
        "[--complete-background-color:var(--step-color)]",
        "[--complete-border-color:var(--step-color)]",
        "[--inactive-border-color:hsl(var(--heroui-default-300))]",
        "[--inactive-color:hsl(var(--heroui-default-300))]",
      ];

      switch (color) {
        case "primary":
          userColor = "[--step-color:hsl(var(--heroui-primary))]";
          fgColor = "[--step-fg-color:hsl(var(--heroui-primary-foreground))]";
          break;
        case "secondary":
          userColor = "[--step-color:hsl(var(--heroui-secondary))]";
          fgColor = "[--step-fg-color:hsl(var(--heroui-secondary-foreground))]";
          break;
        case "success":
          userColor = "[--step-color:hsl(var(--heroui-success))]";
          fgColor = "[--step-fg-color:hsl(var(--heroui-success-foreground))]";
          break;
        case "warning":
          userColor = "[--step-color:hsl(var(--heroui-warning))]";
          fgColor = "[--step-fg-color:hsl(var(--heroui-warning-foreground))]";
          break;
        case "danger":
          userColor = "[--step-color:hsl(var(--heroui-error))]";
          fgColor = "[--step-fg-color:hsl(var(--heroui-error-foreground))]";
          break;
        case "default":
          userColor = "[--step-color:hsl(var(--heroui-default))]";
          fgColor = "[--step-fg-color:hsl(var(--heroui-default-foreground))]";
          break;
        default:
          userColor = "[--step-color:hsl(var(--heroui-primary))]";
          fgColor = "[--step-fg-color:hsl(var(--heroui-primary-foreground))]";
          break;
      }

      if (!className?.includes("--step-fg-color")) colorsVars.unshift(fgColor);
      if (!className?.includes("--step-color")) colorsVars.unshift(userColor);
      if (!className?.includes("--inactive-bar-color"))
        colorsVars.push(
          "[--inactive-bar-color:hsl(var(--heroui-default-300))]",
        );

      return colorsVars;
    }, [color, className]);

    return (
      <nav aria-label="Progress" className="max-w-fit overflow-x-auto">
        <ol
          className={cn(
            "flex flex-row flex-wrap items-center gap-x-2 gap-y-3",
            colors,
            className,
          )}
        >
          {steps?.map((step, stepIdx) => {
            const status =
              currentStep === stepIdx
                ? "active"
                : currentStep < stepIdx
                  ? "inactive"
                  : "complete";

            return (
              <React.Fragment key={stepIdx}>
                <li className="flex items-center">
                  <Button
                    ref={ref}
                    aria-current={status === "active" ? "step" : undefined}
                    className={cn(
                      "group flex flex-row items-center gap-x-3 transition-all duration-200",
                      {
                        "border border-gray-300 bg-white text-gray-500":
                          status === "inactive",
                        "border-primary bg-primary border text-white shadow-lg":
                          status === "active" && variant === "filled",
                        "border-primary text-primary border bg-[#5988FF26]":
                          status === "active" && variant === "default",
                        "border-primary bg-primary border text-white":
                          status === "complete",
                        "px-1 py-2 pe-3": size === "sm",
                        "px-2 py-2": size === "md",
                        "px-3 py-1": size === "lg",
                      },
                      stepClassName,
                    )}
                    radius="full"
                    size={size}
                    onPress={() => setCurrentStep(stepIdx)}
                  >
                    <div className="flex items-center gap-x-3">
                      <LazyMotion features={domAnimation}>
                        <m.div
                          className="flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold"
                          initial={false}
                          transition={{ duration: 0.25 }}
                        >
                          <div className="flex items-center justify-center">
                            {status === "complete" ? (
                              <div
                                className={twMerge(
                                  "grid size-5 place-items-center rounded-full border",
                                  status === "complete" && "bg-white",
                                )}
                              >
                                <CheckIcon className="stroke-primary h-4 w-4" />
                              </div>
                            ) : (
                              <div
                                className={twMerge(
                                  "grid size-5 place-items-center rounded-full border",
                                  status === "active"
                                    ? "border-primary"
                                    : "border-default",
                                )}
                              >
                                <svg
                                  fill="none"
                                  height="14"
                                  viewBox="0 0 15 14"
                                  width="15"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    className={
                                      status == "active"
                                        ? "fill-primary"
                                        : "fill-black/40"
                                    }
                                    d="M13.4643 4.4019L6.46427 11.4019C6.40331 11.4631 6.33086 11.5116 6.25109 11.5447C6.17132 11.5779 6.0858 11.5949 5.99943 11.5949C5.91306 11.5949 5.82754 11.5779 5.74777 11.5447C5.668 11.5116 5.59555 11.4631 5.53459 11.4019L2.47209 8.3394C2.41104 8.27836 2.36262 8.20589 2.32958 8.12613C2.29654 8.04637 2.27954 7.96089 2.27954 7.87456C2.27954 7.78823 2.29654 7.70274 2.32958 7.62298C2.36262 7.54323 2.41104 7.47076 2.47209 7.40971C2.53313 7.34867 2.6056 7.30025 2.68536 7.26721C2.76512 7.23417 2.8506 7.21717 2.93693 7.21717C3.02326 7.21717 3.10874 7.23417 3.1885 7.26721C3.26826 7.30025 3.34073 7.34867 3.40177 7.40971L5.99998 10.0079L12.5357 3.47331C12.659 3.35002 12.8262 3.28076 13.0005 3.28076C13.1749 3.28076 13.3421 3.35002 13.4654 3.47331C13.5887 3.59659 13.6579 3.7638 13.6579 3.93815C13.6579 4.1125 13.5887 4.27971 13.4654 4.40299L13.4643 4.4019Z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        </m.div>
                      </LazyMotion>
                      {step?.title && (
                        <div className="text-sm font-medium">{step.title}</div>
                      )}
                    </div>
                  </Button>
                </li>

                {/* Arrow separator */}
                {stepIdx < steps.length - 1 && !hideProgressBars && (
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9 5l7 7-7 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </li>
                )}
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
    );
  },
);

RowSteps.displayName = "RowSteps";

export default RowSteps;
