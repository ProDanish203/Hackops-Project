"use client";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";
import { FloatingInput } from "../ui/FloatingInput";
import { productSchema } from "@/validations/product.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { CategorySelect, ImageUpload } from "../helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { addProduct, updateProduct } from "@/API/product.api";
import { FileInfo, IProduct } from "@/types/types";

export const ProductForm = ({
  isUpdate,
  productData,
  id,
}: {
  isUpdate?: boolean;
  productData?: IProduct;
  id?: string;
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    register,
    setValue,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
  });

  const [files, setFiles] = useState<FileInfo[]>([]);
  // Set the form values if the form is in update mode
  useEffect(() => {
    if (isUpdate) {
      setValue("title", productData?.name || "");
      setValue("description", productData?.description || "");
      setValue("category", productData?.category._id || "");
      setValue("price", productData?.price.toString() || "");
      setValue("quantity", productData?.stock.toString() || "");
      // console.log(data?.imageUrls);
    }
  }, []);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof productSchema>> = async (
    data
  ) => {
    if (!files.length) return toast.error("Add atleast 1 product image");
    if (files.length > 10) return toast.error("Maximum 10 images allowed");
    const formData = new FormData();
    files.forEach(({ file }) => formData.append("images", file));
    formData.append("name", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("price", data.price);
    formData.append("stock", data.quantity);

    const { response, success } = await mutateAsync(formData);
    if (success) {
      toast.success("Product Added!");
      reset();
      router.push("/products");
    } else return toast.error(response as string);
  };

  const { mutateAsync: updateAsync, isPending: isUpdating } = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  const onUpdate: SubmitHandler<z.infer<typeof productSchema>> = async (
    data
  ) => {
    if (!id) return toast.error("Product ID not found");

    if (productData && productData.imageUrls.length + files.length > 10)
      return toast.error("Maximum 10 images allowed");

    const formData = new FormData();
    files && files.forEach(({ file }) => formData.append("images", file));
    formData.append("name", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("price", data.price);
    formData.append("stock", data.quantity);

    const { response, success } = await updateAsync({
      id,
      formData,
    });
    if (success) {
      toast.success("Product Updated!");
      reset();
      router.push("/products");
    } else return toast.error(response as string);
  };

  return (
    <div>
      <form
        onSubmit={isUpdate ? handleSubmit(onUpdate) : handleSubmit(onSubmit)}
        className="flex flex-col gap-y-7 pt-4 max-w-3xl"
      >
        <ImageUpload
          files={files}
          setFiles={setFiles}
          isUpdate={isUpdate}
          images={productData?.imageUrls}
        />
        <FloatingInput
          placeholder="Product Title"
          type="text"
          name="title"
          register={register}
          isError={errors.title || false}
          errorMessage={errors.title?.message}
        />

        <CategorySelect
          watch={watch}
          setValue={setValue}
          value={productData?.category.name || ""}
          isError={errors.category || false}
          errorMessage={errors.category?.message}
        />
        <Textarea
          placeholder="Product Description"
          name="description"
          register={register}
          className="resize-none"
          isError={errors.description || false}
          errorMessage={errors.description?.message}
        />
        <div className="flex items-center w-full gap-3">
          <FloatingInput
            placeholder="Price"
            type="number"
            inputMode="numeric"
            name="price"
            register={register}
            min={0}
            isError={errors.price || false}
            errorMessage={errors.price?.message}
          />

          <FloatingInput
            placeholder="Quantity"
            type="number"
            inputMode="numeric"
            name="quantity"
            register={register}
            min={0}
            isError={errors.quantity || false}
            errorMessage={errors.quantity?.message}
          />
        </div>
        <Button
          className="disabled:opacity-50 mt-2 bg-primaryCol hover:bg-primaryCol/90 text-darkText"
          type="submit"
          disabled={isUpdate ? isUpdating : isPending}
        >
          {isUpdate ? "Update Product" : "Add Product"}
        </Button>
      </form>
    </div>
  );
};
