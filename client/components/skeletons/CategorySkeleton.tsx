import React from "react";
import { Skeleton } from "../ui/skeleton";

export const CategorySkeleton = () => {
  return (
    <>
      {new Array(6).fill(0).map((_, i) => (
        <div className="flex flex-col gap-y-2" key={i}>
          <Skeleton className="rounded-lg h-40 w-full bg-neutral-100 dark:bg-neutral-800" />
          <Skeleton className="rounded-lg h-4 w-52 bg-neutral-100 dark:bg-neutral-800" />
          <Skeleton className="rounded-lg h-4 w-[90%] bg-neutral-100 dark:bg-neutral-800" />
        </div>
      ))}
    </>
  );
};
