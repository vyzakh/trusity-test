import { Listbox, ListboxItem } from "@heroui/listbox";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { ScrollShadow } from "@heroui/scroll-shadow";
import clsx from "clsx";
import * as React from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { twMerge } from "tailwind-merge";

import type { ButtonProps } from "@heroui/button";
import type { InputProps } from "@heroui/input";
import Button from "./button";
import { Input } from "./input";

interface PhoneInputProps
  extends Omit<InputProps, "onChange" | "value" | "ref"> {
  value?: string;
  // value?: RPNInput.Value;
  onChange?: (value?: RPNInput.Value) => void;
  countries?: RPNInput.Country[];
  defaultCountry?: RPNInput.Country;
  international?: boolean;
  withCountryCallingCode?: boolean;
  countryCallingCodeEditable?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  className,
  onChange,
  value,
  size = "md",
  variant = "bordered",
  isDisabled,
  label,
  errorMessage,
  isRequired,
  isInvalid,
  ...props
}) => {
  return (
    <div className="flex w-full flex-col gap-1">
      <label
        className={clsx(
          "ms-0.5 inline-block max-w-sm text-sm",
          className,
          isRequired && "required",
          isInvalid && "text-danger",
          size === "sm" ? "text-xs" : size === "lg" ? "!text-base" : "text-sm",
        )}
        htmlFor="phoneNumber"
      >
        {label}
      </label>
      <RPNInput.default
        className={clsx(
          "flex",
          className,
          "border-default-200 hover:border-default-400 rounded-xl border-1",
          isInvalid
            ? "!border-danger focus-within:!border-danger"
            : "focus-within:!border-primary",
          size === "lg" ? "h-10" : size == "sm" ? "h-8" : "h-9",
        )}
        countrySelectComponent={(countrySelectProps) => (
          <CountrySelect
            {...countrySelectProps}
            isDisabled={isDisabled}
            isInvalid={isInvalid}
            size={size}
            variant={variant}
          />
        )}
        flagComponent={FlagComponent}
        inputComponent={InputComponent}
        smartCaret={false}
        value={value || undefined}
        onBlur={props.onBlur}
        onChange={(value) => onChange?.(value || ("" as RPNInput.Value))}
        {...props}
      />

      {isInvalid && errorMessage && (
        <small className="text-tiny text-danger">
          {errorMessage as string}
        </small>
      )}
    </div>
  );
};

interface InputComponentProps
  extends Omit<
    React.ComponentProps<"input">,
    "size" | "color" | "defaultValue"
  > {
  size?: InputProps["size"];
  variant?: InputProps["variant"];
  color?: InputProps["color"];
  radius?: InputProps["radius"];
  isDisabled?: boolean;
  isReadOnly?: boolean;
  label?: InputProps["label"];
  labelPlacement?: InputProps["labelPlacement"];
  description?: InputProps["description"];
  errorMessage?: InputProps["errorMessage"];
  isRequired?: boolean;
  isInvalid?: boolean;
  startContent?: InputProps["startContent"];
  endContent?: InputProps["endContent"];
  classNames?: InputProps["classNames"];
  ref?: React.Ref<HTMLInputElement>;
}

const InputComponent: React.FC<InputComponentProps> = ({
  className,
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  disabled,
  readOnly,
  name,
  id,
  autoComplete,
  size = "md",
  color = "default",
  radius,
  isDisabled,
  isReadOnly,
  labelPlacement,
  description,
  errorMessage,
  endContent,
  classNames,
  ref,
  spellCheck,
}) => (
  <Input
    ref={ref}
    autoComplete={autoComplete}
    className={clsx(className, "border-default-200 border-l-1")}
    classNames={{
      ...classNames,
      input: clsx("rounded-r-lg rounded-l-none", classNames?.input),
      inputWrapper: clsx(
        "rounded-r-lg rounded-l-none h-8 border-none shadow-none",
        classNames?.inputWrapper,
        size === "lg" ? "h-9" : size == "sm" ? "h-7" : "h-8",
      ),
      mainWrapper: "block",
    }}
    color={color}
    description={description}
    endContent={endContent}
    errorMessage={errorMessage}
    id={id}
    isDisabled={disabled || isDisabled}
    isReadOnly={readOnly || isReadOnly}
    label={null}
    labelPlacement={labelPlacement}
    name={name}
    placeholder={placeholder}
    radius={radius}
    size={size}
    spellCheck={
      typeof spellCheck === "boolean"
        ? spellCheck
          ? "true"
          : "false"
        : spellCheck
    }
    value={typeof value === "string" ? value : value?.toString() || ""}
    variant="bordered"
    onBlur={onBlur}
    onChange={(e) => onChange?.(e)}
    onFocus={onFocus}
  />
);

InputComponent.displayName = "InputComponent";

type CountryEntry = { label: string; value: RPNInput.Country | undefined };

interface CountrySelectProps {
  disabled?: boolean;
  value: RPNInput.Country;
  options: CountryEntry[];
  onChange: (country: RPNInput.Country) => void;
  size?: InputProps["size"];
  isDisabled?: boolean;
  variant?: InputProps["variant"];
  isInvalid?: boolean;
}

const CountrySelect = React.memo<CountrySelectProps>(
  ({
    disabled,
    value: selectedCountry,
    options: countryList,
    onChange,
    size = "md",
    variant = "flat",
    isDisabled,
    isInvalid,
  }) => {
    const [searchValue, setSearchValue] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);

    const filteredCountries = React.useMemo(() => {
      if (!searchValue) return countryList;

      return countryList.filter(({ label }) =>
        label.toLowerCase().includes(searchValue.toLowerCase()),
      );
    }, [countryList, searchValue]);

    const buttonSizeMap = {
      sm: "sm",
      md: "md",
      lg: "lg",
    } as const;

    const selectVariant = (
      variant: InputProps["variant"],
    ): ButtonProps["variant"] => {
      switch (variant) {
        case "bordered":
          return "bordered";

        case "faded":
          return "flat";

        case "underlined":
          return "light";

        case "flat":
          return "flat";

        default:
          return "flat";
      }
    };

    return (
      <Popover
        isOpen={isOpen}
        placement="bottom-start"
        triggerScaleOnOpen={false}
        onOpenChange={setIsOpen}
      >
        <PopoverTrigger>
          <Button
            className={twMerge(
              "z-10 h-full min-w-0 rounded-r-none border-none px-4",
              isInvalid && "border-[#FF0000]",
            )}
            endContent={
              !(disabled || isDisabled) && (
                <svg
                  className="ml-auto shrink-0"
                  fill="none"
                  height="8"
                  viewBox="0 0 15 8"
                  width="12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 0.75L7.5 7.25L1 0.75"
                    stroke="#929292"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              )
            }
            isDisabled={disabled || isDisabled}
            size={buttonSizeMap[size] || "md"}
            variant={selectVariant(variant)}
          >
            <FlagComponent
              country={selectedCountry}
              countryName={selectedCountry}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-1">
          <div className="px-1 py-2">
            <Input
              placeholder="Search country..."
              size="sm"
              startContent={
                <svg
                  fill="none"
                  height="22"
                  viewBox="0 0 23 22"
                  width="23"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.2397 19.7398C20.1114 19.8662 19.9386 19.9372 19.7585 19.9375C19.5759 19.9367 19.4006 19.866 19.2687 19.7398L15.5562 16.0188C13.9926 17.3321 11.9824 17.991 9.94478 17.8582C7.90717 17.7254 5.99949 16.8111 4.61961 15.306C3.23974 13.8009 2.4942 11.8211 2.53849 9.7797C2.58278 7.73825 3.41348 5.79271 4.85734 4.34885C6.30121 2.90499 8.24674 2.07429 10.2882 2.03C12.3296 1.9857 14.3094 2.73124 15.8145 4.11112C17.3196 5.491 18.2339 7.39868 18.3667 9.43629C18.4995 11.4739 17.8405 13.4841 16.5272 15.0477L20.2397 18.7602C20.3047 18.8241 20.3563 18.9004 20.3915 18.9845C20.4267 19.0686 20.4448 19.1588 20.4448 19.25C20.4448 19.3412 20.4267 19.4314 20.3915 19.5155C20.3563 19.5996 20.3047 19.6759 20.2397 19.7398ZM10.4772 16.5C11.769 16.5 13.0318 16.117 14.1058 15.3993C15.1799 14.6816 16.017 13.6616 16.5113 12.4682C17.0057 11.2747 17.135 9.96151 16.883 8.69457C16.631 7.42763 16.0089 6.26387 15.0955 5.35046C14.1821 4.43705 13.0184 3.81501 11.7514 3.563C10.4845 3.31099 9.17127 3.44033 7.97784 3.93467C6.78441 4.429 5.76437 5.26613 5.04671 6.34019C4.32905 7.41424 3.946 8.67699 3.946 9.96875C3.94827 11.7003 4.63711 13.3602 5.86147 14.5845C7.08582 15.8089 8.74575 16.4977 10.4772 16.5Z"
                    fill="#B0B0B0"
                  />
                </svg>
              }
              value={searchValue}
              onValueChange={setSearchValue}
            />
          </div>
          <ScrollShadow
            className="max-h-72 w-full max-w-80"
            orientation="vertical"
          >
            <Listbox
              aria-label="Country selection"
              onAction={(key) => {
                const country = key as RPNInput.Country;

                onChange(country);
                setIsOpen(false);
                setSearchValue(""); // Reset search when selecting
              }}
            >
              {filteredCountries.length === 0 ? (
                <ListboxItem key="no-results" className="text-default-400">
                  No country found.
                </ListboxItem>
              ) : (
                filteredCountries.map(({ value, label }) =>
                  value ? (
                    <ListboxItem
                      key={value}
                      className="gap-2"
                      endContent={
                        <div className="flex items-center gap-2">
                          <span className="text-default-400 text-sm">
                            +{RPNInput.getCountryCallingCode(value)}
                          </span>
                        </div>
                      }
                      startContent={
                        <FlagComponent country={value} countryName={label} />
                      }
                    >
                      {label}
                    </ListboxItem>
                  ) : null,
                )
              )}
            </Listbox>
          </ScrollShadow>
        </PopoverContent>
      </Popover>
    );
  },
);

CountrySelect.displayName = "CountrySelect";

const FlagComponent = ({
  country,
  countryName,
}: RPNInput.FlagProps): React.ReactElement => {
  const Flag = flags[country];

  return (
    <span className="bg-default-100 flex h-4 w-6 shrink-0 overflow-hidden rounded-sm">
      {Flag ? <Flag title={countryName} /> : null}
    </span>
  );
};

FlagComponent.displayName = "FlagComponent";

export { PhoneInput };
export type { PhoneInputProps };
