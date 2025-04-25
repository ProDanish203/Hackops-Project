"use client";
import { loginSchema } from "@/validations/auth.validation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "@/API/auth.api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/store/AuthProvider";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/FloatingInput";
import { PasswordInput } from "@/components/ui/PasswordInput";

const LoginPage = () => {
  const router = useRouter();
  const { setUser } = useAuth();

  const { mutateAsync } = useMutation({
    mutationFn: loginUser,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof loginSchema>> = async (data) => {
    const { response, success } = await mutateAsync(data);
    if (success) {
      setUser(response.data);
      localStorage.setItem("token", response.token);
      toast.success("Login successfull");
      router.push("/");
    } else return toast.error(response as string);
  };

  return (
    <section className="max-w-lg mx-auto w-full max-xs:px-4 z-10">
      <h2 className="font-bold text-5xl text-center">Log In</h2>
      <p className="text-neutral-400 text-sm font-roboto font-normal text-center mt-5">
        Login using your credentials to access your account
      </p>
      <form
        className="max-w-md mx-auto bg-bg dark:bg-darkBg rounded-3xl sm:p-8 p-2 z-10 mt-8 flex flex-col gap-y-7"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="relative">
          <FloatingInput
            placeholder="Email Address"
            type="email"
            name="email"
            register={register}
          />
          {errors.email && (
            <span className="mt-1 absolute text-red-500 text-[12px]">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="relative w-full mb-1">
          <PasswordInput
            placeholder="Password"
            type="password"
            name="password"
            register={register}
          />
          {errors.password && (
            <span className="mt-1 absolute text-red-500 text-[12px]">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-x-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              className="accent-primaryCol"
            />
            <label
              htmlFor="remember"
              className="text-sm font-roboto text-para leading-none"
            >
              Remember Me
            </label>
          </div>
          <Link
            href="#"
            className="text-primaryCol underline font-roboto text-sm"
          >
            Forgot Password
          </Link>
        </div>

        <Button
          role="submit"
          className="py-6 bg-primaryCol hover:bg-primaryCol/90 text-[16px] rounded-lg text-darkText"
          size="lg"
          disabled={isSubmitting}
        >
          Login
        </Button>
      </form>
    </section>
  );
};

export default LoginPage;
