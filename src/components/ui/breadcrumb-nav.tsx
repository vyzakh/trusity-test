import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { Skeleton } from "@heroui/skeleton";
import React from "react";
import { Link } from "react-router";

type BreadcrumbEntry = {
  label?: string;
  to?: string;
  isLoading?: boolean;
};

type BreadcrumbNavProps = {
  items: BreadcrumbEntry[];
  underline?: "hover" | "always" | "none";
};

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  items,
  underline = "hover",
}) => {
  return (
    <Breadcrumbs underline={underline}>
      {items.map((item, index) => (
        <BreadcrumbItem key={index}>
          {item.isLoading ? (
            <Skeleton className="h-3 w-40 rounded-xl" />
          ) : item.to ? (
            <Link to={item.to}>
              <p className="max-w-32 truncate">{item.label}</p>
            </Link>
          ) : (
            <p className="max-w-xs truncate">{item.label}</p>
          )}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
};

export default BreadcrumbNav;
