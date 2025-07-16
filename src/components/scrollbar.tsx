import React from "react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

type ScrollbarProps = {
  children: React.ReactNode;
  slotProps?: {
    wrapper?: React.CSSProperties;
    contentWrapper?: React.CSSProperties;
    content?: React.CSSProperties;
  };
  fillContent?: boolean;
  className?: string;
};

export default function Scrollbar({
  children,
  slotProps,
  fillContent,
  className = "",
  ...other
}: ScrollbarProps) {
  return (
    <SimpleBar
      className={`flex min-h-0 min-w-0 grow flex-col ${className}`}
      clickOnTrack={false}
      style={{
        ...slotProps?.wrapper,
      }}
      {...other}
    >
      <div
        className={`${fillContent ? "flex min-h-px flex-1 flex-col" : ""}`}
        style={{
          ...slotProps?.content,
        }}
      >
        {children}
      </div>
    </SimpleBar>
  );
}
