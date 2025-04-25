import { ICategory } from "@/types/types";
import Image from "next/image";
import { Button } from "../ui/button";
import { Pen } from "lucide-react";
import { CategoryForm } from "../forms";

export const CategoryCard = ({
  name,
  imageUrl,
  description,
  slug,
  _id,
}: ICategory) => {
  return (
    <div className="bg-neutral-100 dark:bg-neutral-900 p-2.5 pb-4 rounded-lg relative">
      <div className="flex items-start flex-col gap-x-3">
        <div className="w-full center mb-5">
          <Image
            src={imageUrl}
            alt={name}
            width={70}
            height={70}
            className="object-cover rounded-lg"
          />
        </div>
        <div className="pt-2">
          <h3 className="text-lg font-semibold dark:text-neutral-200 text-neutral-800">
            {name}
          </h3>
          <p className="sm:text-sm text-xs dark:text-neutral-300 text-neutral-600">
            {description && description.length > 40
              ? description?.slice(0, 40) + "..."
              : description}
          </p>
        </div>
      </div>

      <CategoryForm
        isUpdate
        name={name}
        description={description}
        image={imageUrl}
        slug={slug}
        id={_id}
      />
    </div>
  );
};
