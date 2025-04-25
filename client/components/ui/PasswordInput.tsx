"use client";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { UseFormRegister, FieldValues, Path } from "react-hook-form";

interface Props<T extends FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegister<T>;
}

export const PasswordInput = <T extends FieldValues>({
  name,
  placeholder,
  register,
  ...rest
}: Props<T>) => {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="relative w-full">
      <input
        {...rest}
        type={showPass ? "text" : "password"}
        id={name}
        className="block px-2.5 pb-2.5 pt-2.5 w-full text-sm text-lightGray bg-transparent rounded-lg border border-borderCol dark:border-neutral-800 appearance-none focus:outline-none focus:ring-0 focus:border-primaryCol peer"
        placeholder=""
        {...register(name as Path<T>)}
      />
      <label
        htmlFor={name}
        className="absolute text-sm text-gray-400  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-bg dark:bg-darkBg  px-2 peer-focus:px-2 peer-focus:text-primaryCol peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
      >
        {placeholder}
      </label>
      <button
        type="button"
        className="absolute right-3 top-3"
        onClick={() => setShowPass((prev) => !prev)}
      >
        {showPass ? (
          <Eye className="size-5 text-gray-500" />
        ) : (
          <EyeOff className="size-5 text-gray-500" />
        )}
      </button>
    </div>
  );
};
