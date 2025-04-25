"use client";
import { getCategoryNames } from "@/API/category.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";

export const CategorySelect = ({
  watch,
  setValue,
  value,
  errorMessage,
  isError,
}: {
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  value?: string;
  isError?: any;
  errorMessage?: string;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["category-names"],
    queryFn: () => getCategoryNames(),
  });

  const category = watch("category");

  return (
    <Select
      onValueChange={(e) => setValue("category", e, { shouldValidate: true })}
    >
      <SelectTrigger
        className={cn(
          "text-gray-400",
          category && "text-black dark:text-white",
          isError && "text-red-500 border-red-500"
        )}
      >
        <SelectValue placeholder={value || "Select a category"} />
      </SelectTrigger>
      <SelectContent className="max-h-52">
        {isLoading ? (
          <SelectItem value="loading">Loading...</SelectItem>
        ) : (
          data &&
          data.success &&
          data.response.length > 0 &&
          data?.response.map((category: any) => (
            <SelectItem key={category._id} value={category._id}>
              {category.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};
