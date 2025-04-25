import React from "react";
import { Skeleton } from "../ui/skeleton";

export const TableSkeleton = () => {
  return (
    <div>
      <Skeleton className="h-12 w-full bg-neutral-100 dark:bg-neutral-800" />
    </div>
  );
};
