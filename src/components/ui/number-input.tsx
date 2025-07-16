import {
  NumberInput as HerouiNumberInput,
  type NumberInputProps,
} from "@heroui/number-input";
import React from "react";

const NumberInput: React.FC<NumberInputProps> = ({
  labelPlacement = "outside",
  variant = "bordered",
  ...props
}) => {
  return (
    <HerouiNumberInput
      {...props}
      classNames={{ inputWrapper: "border-small" }}
      labelPlacement={labelPlacement}
      variant={variant}
    />
  );
};

export default NumberInput;
