"use client";
import { getCurrentUser, logoutUser } from "@/API/auth.api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/store/AuthProvider";
import { IUser } from "@/types/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

export const UserAvatar = () => {
  const router = useRouter();

  const { user, setUser }: { user: IUser; setUser: (user: any) => void } =
    useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => getCurrentUser(),
    initialData: user ? { success: true, response: user } : undefined,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: logoutUser,
  });

  const handleLogout = async () => {
    const { success, response } = await mutateAsync();
    if (!success) return toast.error(response);
    setUser(undefined);
    toast.success("Logged out successfully");
    localStorage.removeItem("token");
    router.push("/login");
  };

  useEffect(() => {
    if (!isLoading && data && data.success && data.response) {
      setUser(data.response);
    } else if (!isLoading && data && !data.success) {
      typeof window !== undefined && localStorage.removeItem("token");
      handleLogout();
      router.push("/login");
    }
  }, [data]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none flex items-center justify-start gap-x-2">
        {user && (
          <>
            <Avatar>
              <AvatarImage src="/images/dummy-user.webp" alt={user.name} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="max-md:hidden text-left">
              <p className="text-text dark:text-darkText text-sm">
                {user.name}
              </p>
              <p className="text-xs text-neutral-500">@{user.role}</p>
            </div>
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isPending}
          className="max-sm:text-xs flex items-center gap-x-2 sm:py-3 py-2 cursor-pointer"
        >
          <LogOut className="sm:size-5 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
