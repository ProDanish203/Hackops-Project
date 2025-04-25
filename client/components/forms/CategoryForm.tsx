"use client";
import { useEffect, useState } from "react";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { Button } from "../ui/button";
import { Pen, Plus } from "lucide-react";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { convertImage } from "@/lib/helpers";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "@/validations/category.validation";
import { FloatingInput } from "../ui/FloatingInput";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory, updateCategory } from "@/API/category.api";

export const CategoryForm = ({
  isUpdate,
  name,
  description,
  image,
  slug,
  id,
}: {
  isUpdate?: boolean;
  name?: string;
  description?: string;
  image?: string;
  slug?: string;
  id?: string;
}) => {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(image || "");

  useEffect(() => {
    if (isUpdate) {
      setValue("name", name || "");
      setValue("description", description || "");
      setValue("slug", slug || "");
    }
  }, []);

  const handleFileChange = async (file: File | undefined) => {
    if (!file) return;
    setFile(file);
    const response = await convertImage(file);
    setPreview(response);
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof categorySchema>> = async (
    data
  ) => {
    if (!file) return toast.error("Image is required");

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("slug", data.slug);
    formData.append("image", file);

    const { response, success } = await mutateAsync(formData);
    if (success) {
      toast.success("Caetgory added successfully");
      reset();
      setFile(null);
      setPreview("");
      setOpen(false);
    } else return toast.error(response as string);
  };

  const { mutateAsync: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });

  const onUpdate: SubmitHandler<z.infer<typeof categorySchema>> = async (
    data
  ) => {
    if (!id) return toast.error("Category id is required");
    console.log(data);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("slug", data.slug);
    file && formData.append("image", file);

    const { response, success } = await updateMutate({
      formData,
      id,
    });
    if (success) {
      toast.success("Caetgory updated successfully");
      reset();
      setFile(null);
      setPreview("");
      setOpen(false);
    } else return toast.error(response as string);
  };

  return (
    <Credenza
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
        // e === false && reset();
      }}
    >
      {isUpdate ? (
        <CredenzaTrigger className="absolute -top-2 -right-2 shadow-md bg-green-500 dark:bg-green-700 rounded-lg py-2 px-2 text-darkText active:scale-[1.04]">
          <Pen className="size-5" />
        </CredenzaTrigger>
      ) : (
        <CredenzaTrigger className="flex items-center gap-x-1 bg-primaryCol text-darkText py-2 px-4 text-sm rounded-md">
          Add Category
          <Plus className="size-5" />
        </CredenzaTrigger>
      )}
      <CredenzaContent className="max-md:min-h-[400px] dark:bg-neutral-900 dark:border-neutral-800">
        <CredenzaHeader>
          <CredenzaTitle>
            {isUpdate ? "Update Category" : "Add Category"}{" "}
          </CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody className="sm:max-h-[600px] max-h-[500px] overflow-y-auto">
          <form
            onSubmit={
              isUpdate ? handleSubmit(onUpdate) : handleSubmit(onSubmit)
            }
            className="flex flex-col gap-y-4 border-t border-neutral-200 dark:border-neutral-800 pt-4"
          >
            <div>
              {/* Image input */}
              <label htmlFor="category-file" className="relative h-40 w-full">
                {preview ? (
                  <div className="w-full center">
                    <Image
                      src={preview}
                      alt="category-preview"
                      width={70}
                      height={70}
                      className="object-cover size-[80px] cursor-pointer"
                    />
                  </div>
                ) : (
                  <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg py-5 px-5 w-full h-40 center gap-x-1 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800/80 transition-all duration-100">
                    <p>Add Image</p>
                    <Plus />
                  </div>
                )}
              </label>
              <input
                type="file"
                id="category-file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files?.[0])}
              />
              {/* Display images */}
            </div>

            <FloatingInput
              type="text"
              name="name"
              id="name"
              placeholder="Enter category name*"
              register={register}
              isError={errors.name || false}
              errorMessage={errors.name?.message}
            />
            <Textarea
              rows={5}
              id="description"
              placeholder="Enter category description"
              name="description"
              register={register}
              isError={errors.description || false}
              errorMessage={errors.description?.message}
            />
            <FloatingInput
              type="text"
              name="slug"
              id="slug"
              placeholder="Enter category slug*"
              register={register}
              isError={errors.slug || false}
              errorMessage={errors.slug?.message}
            />

            <CredenzaFooter className="">
              <Button
                className="w-full bg-primaryCol hover:bg-primaryCol/90 text-darkText disabled:opacity-50"
                type="submit"
                disabled={isUpdate ? isUpdating : isPending}
              >
                {isUpdate ? "Update Category" : "Add Category"}
              </Button>
            </CredenzaFooter>
          </form>
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
};
