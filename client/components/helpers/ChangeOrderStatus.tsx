"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeOrderStatus } from "@/API/order.api";
import { toast } from "sonner";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { useState } from "react";

export const ChangeOrderStatus = ({
  id,
  orderStatus,
}: {
  id: string;
  orderStatus: string;
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: changeOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });

  const handleStatusChange = async (status: string) => {
    if (status === orderStatus) return;
    const { response, success } = await mutateAsync({
      id,
      status,
    });
    if (success) setOpen(false);
    else return toast.error(response as string);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="outline" className="">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="flex flex-col gap-y-2">
          <Link href={`/orders/${id}`}>
            <DropdownMenuItem role="link">View Details</DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            role="link"
            onClick={() => handleStatusChange("pending")}
          >
            Mark as Pending
          </DropdownMenuItem>

          <DropdownMenuItem
            role="link"
            onClick={() => handleStatusChange("processing")}
          >
            Mark as Processing
          </DropdownMenuItem>
          <DropdownMenuItem
            role="link"
            onClick={() => handleStatusChange("completed")}
          >
            Mark as Completed
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              orderStatus !== "cancelled" && setOpen(true);
            }}
            className="bg-red-500 focus:bg-red-600 focus:text-darkText dark:focus:bg-red-600 text-darkText"
          >
            Cancel Order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmationDialog
        open={open}
        setOpen={setOpen}
        alertType="cancel"
        onAccept={() => handleStatusChange("cancelled")}
      />
    </>
  );
};
