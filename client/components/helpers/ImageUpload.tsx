import { convertImage } from "@/lib/helpers";
import { FileInfo } from "@/types/types";
import { Plus, X } from "lucide-react";
import Image from "next/image";

export const ImageUpload = ({
  files,
  setFiles,
  images,
  isUpdate,
}: {
  isUpdate?: boolean;
  images?: string[];
  files: FileInfo[];
  setFiles: React.Dispatch<React.SetStateAction<FileInfo[]>>;
}) => {
  const handleFileChange = async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const newFiles = Array.from(selectedFiles).slice(0, 10 - files.length);

    const filePromises = newFiles.map(async (file) => {
      const preview = await convertImage(file);
      return { file, preview };
    });

    const newFileInfos = await Promise.all(filePromises);
    setFiles((prevFiles) => [...prevFiles, ...newFileInfos].slice(0, 10));
  };

  const removeFile: any = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div>
      {/* Image input */}
      <label
        htmlFor="product-files"
        className="bg-neutral-100 border dark:bg-neutral-800 dark:border-neutral-950 rounded-lg py-5 px-5 sm:size-44 w-full center gap-x-1 cursor-pointer h-40 hover:bg-neutral-200 dark:hover:bg-neutral-800/80 transition-all duration-100"
      >
        <p>Add Images</p>
        <Plus />
      </label>
      <input
        type="file"
        id="product-files"
        className="hidden"
        accept="image/*"
        multiple
        onChange={(e) => handleFileChange(e.target.files)}
      />
      {/* Display images */}
      <div className="mt-3 flex items-center gap-3 flex-wrap justify-start">
        {isUpdate &&
          images?.length &&
          images.map((image, idx) => (
            <DisplayImage
              key={idx}
              preview={image}
              index={idx}
              removeFile={removeFile}
              showCross
            />
          ))}
        {files.map(({ preview }, index) => (
          <DisplayImage
            key={index}
            preview={preview}
            index={index}
            removeFile={removeFile}
            showCross={images?.length === 0 || !images}
          />
        ))}
      </div>
    </div>
  );
};

const DisplayImage = ({
  index,
  preview,
  removeFile,
  showCross,
}: {
  preview: string;
  index: number;
  removeFile: any;
  showCross?: boolean;
}) => {
  return (
    <div className="relative">
      <Image
        src={preview}
        alt="product-picture"
        width={200}
        height={200}
        className={`${
          showCross && index === 0 && "border-2 border-primaryCol"
        } rounded-md object-cover w-[120px] h-[100px]`}
      />
      <button
        type="button"
        className="bg-red-600 text-darkText rounded-full center size-6 absolute -top-2 -right-2 shadow-md"
        onClick={() => removeFile(index)}
      >
        <X className="size-4" />
      </button>
    </div>
  );
};
