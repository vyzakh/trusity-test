import type { InputProps } from "@heroui/input";
import React from "react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../icons";
import Input from "./input";

export default function PasswordInput(props: InputProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      isRequired
      endContent={
        <button
          aria-label="toggle password visibility"
          className="hover:cursor-pointer focus:outline-hidden"
          type="button"
          onClick={toggleVisibility}
        >
          {isVisible ? (
            <EyeSlashFilledIcon className="text-default-400 pointer-events-none text-2xl" />
          ) : (
            <EyeFilledIcon className="text-default-400 pointer-events-none text-2xl" />
          )}
        </button>
      }
      type={isVisible ? "text" : "password"}
      {...props}
    />
  );
}
