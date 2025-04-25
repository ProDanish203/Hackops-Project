"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { FilterIcon } from "lucide-react";
import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const Filter = ({
  isOrders,
  isCategories,
}: {
  isOrders?: boolean;
  isCategories?: boolean;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, filter: string) => {
    router.push(
      pathname + "?" + createQueryString(name.toString(), filter.toString()),
      { scroll: false }
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-x-1"
        >
          <FilterIcon className="size-4" />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isOrders ? (
          <>
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleFilterChange("filter", "")}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleFilterChange("filter", "pending")}
            >
              Pending
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleFilterChange("filter", "completed")}
            >
              Completed
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleFilterChange("filter", "cancelled")}
            >
              Cancelled
            </DropdownMenuItem>
          </>
        ) : isCategories ? (
          <>
            <DropdownMenuLabel>Alphabetically</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleFilterChange("filter", "atoz")}
            >
              A-Z
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleFilterChange("filter", "ztoa")}
            >
              Z-A
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel>Price</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Low To High</DropdownMenuItem>
            <DropdownMenuItem>High To Low</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Rating</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Low To High</DropdownMenuItem>
            <DropdownMenuItem>High To Low</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
