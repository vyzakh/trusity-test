import React from "react";
import { title } from "./primitives";

type PageWrapperProps = {
  children: React.ReactNode;
  slots?: {
    breadcrumb?: React.ReactNode;
    title?: React.ReactNode;
    actions?: React.ReactNode[];
  };
};

export default function PageWrapper({ children, slots }: PageWrapperProps) {
  return (
    <section className="flex flex-col gap-1">
      {slots?.breadcrumb}
      {(slots?.title || slots?.actions) && (
        <div className="flex items-center justify-between">
          <h1 className={title({ size: "lg" })}>{slots.title}</h1>
          <div className="ms-auto flex items-center gap-1">
            {slots?.actions?.map((action, i) => (
              <React.Fragment key={i}>{action}</React.Fragment>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 flex w-full grow flex-col gap-5">{children}</div>
    </section>
  );
}
