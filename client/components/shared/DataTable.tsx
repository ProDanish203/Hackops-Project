"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { ChangeOrderStatus, ConfirmationDialog, Pagination } from "../helpers";
import Link from "next/link";
import { Suspense, useState } from "react";
import { IOrderMin, IPagination, IProduct, IUser } from "@/types/types";
import { TableSkeleton } from "../skeletons";
import { formatDate, formatDateToTime } from "@/lib/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteProduct } from "@/API/product.api";

export const DataTable = ({
  headers,
  isOrders,
  isProduct,
  isUsers,
  data,
  pagination,
  isLoading,
}: {
  headers: { name: string; key: string }[];
  isProduct?: boolean;
  isOrders?: boolean;
  isUsers?: boolean;
  data: any;
  pagination: IPagination;
  isLoading: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("delete");
  const [alertId, setAlertId] = useState("");

  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  const handleDeleteProduct = async (id: string) => {
    if (!id) return;
    const { response, success } = await mutateAsync(id);
    if (success) {
      setOpen(false);
      return toast.success("Product deleted successfully");
    } else return toast.error(response as string);
  };

  return (
    <div className="w-full">
      <div className="max-h-[58vh] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow className="dark:hover:bg-neutral-900 dark:border-neutral-800">
              {headers.map(({ name }, idx) => (
                <TableHead
                  key={idx}
                  className="min-w-[130px] text-text dark:text-darkText"
                >
                  {name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <>
                {headers.map((_, idx) => (
                  <TableRow
                    className="dark:hover:bg-neutral-900 dark:border-neutral-800"
                    key={idx}
                  >
                    {headers.map((_, idx) => (
                      <TableCell key={idx}>
                        <TableSkeleton />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            ) : (
              <>
                {isProduct && data && data.length > 0
                  ? data.map((product: IProduct, idx: number) => (
                      <TableRow
                        className="dark:hover:bg-neutral-900 dark:border-neutral-800 overflow-x-hidden"
                        key={idx}
                      >
                        <TableCell className="min-w-[250px] flex items-center gap-x-2">
                          {product.imageUrls &&
                            product.imageUrls.length > 0 && (
                              <Image
                                src={product.imageUrls[0]}
                                alt={product.name}
                                width={200}
                                height={200}
                                className="object-cover min-w-[80px] w-[80px] h-[50px] rounded-lg "
                              />
                            )}
                          <p className="text-text dark:text-darkText">
                            {product.name}
                          </p>
                        </TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{product.rating}</TableCell>
                        <TableCell>
                          {product.description.length > 25
                            ? `${product.description.slice(0, 25)}...`
                            : product.description}
                        </TableCell>
                        <TableCell>
                          {" "}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                className=""
                              >
                                <EllipsisVertical />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="flex flex-col gap-y-2"
                            >
                              <Link href={`/products/update/${product._id}`}>
                                <DropdownMenuItem role="link">
                                  Update
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem
                                onClick={() => {
                                  setOpen(true);
                                  setAlertType("delete");
                                  setAlertId(product._id);
                                }}
                                className="bg-red-500 focus:bg-red-600 focus:text-darkText dark:focus:bg-red-600 text-darkText"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  : isProduct && (
                      <TableRow>
                        <TableCell
                          colSpan={headers.length}
                          className="text-start text-3xl pt-10"
                        >
                          No products found
                        </TableCell>
                      </TableRow>
                    )}

                {isOrders && data && data.length > 0
                  ? data.map((order: IOrderMin, idx: number) => (
                      <TableRow
                        className="dark:hover:bg-neutral-900 dark:border-neutral-800 overflow-x-hidden"
                        key={idx}
                      >
                        <TableCell>#{order.trackingNumber}</TableCell>
                        <TableCell>{order.name}</TableCell>
                        <TableCell>
                          {formatDateToTime(order.createdAt)}
                        </TableCell>
                        <TableCell>${order.totalAmount}</TableCell>
                        <TableCell
                          className={`font-medium ${
                            order.orderStatus === "pending"
                              ? "text-blue-500"
                              : order.orderStatus === "completed"
                              ? "text-green-500"
                              : order.orderStatus === "processing"
                              ? "text-yellow-500"
                              : order.orderStatus === "cancelled"
                              ? "text-red-500"
                              : ""
                          }`}
                        >
                          {order.orderStatus}
                        </TableCell>
                        <TableCell>
                          {" "}
                          <ChangeOrderStatus
                            id={order._id}
                            orderStatus={order.orderStatus}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  : isOrders && (
                      <TableRow>
                        <TableCell
                          colSpan={headers.length}
                          className="text-start text-3xl pt-10"
                        >
                          No orders found
                        </TableCell>
                      </TableRow>
                    )}

                {isUsers && data && data.length > 0
                  ? data.map((user: IUser, idx: number) => (
                      <TableRow
                        className="dark:hover:bg-neutral-900 dark:border-neutral-800 overflow-x-hidden"
                        key={idx}
                      >
                        <TableCell className="min-w-[250px] flex items-center gap-x-2">
                          <Image
                            src={user.avatar || "/images/dummy-user.webp"}
                            alt={user.name}
                            width={200}
                            height={200}
                            className="object-cover size-10 rounded-full"
                          />
                          <p className="text-text dark:text-darkText">
                            {user.name}
                          </p>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>+{user.phone}</TableCell>
                        <TableCell>{user.address || "N/A"}</TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                      </TableRow>
                    ))
                  : isUsers && (
                      <TableRow>
                        <TableCell
                          colSpan={headers.length}
                          className="text-start text-3xl pt-10"
                        >
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && (
        <Suspense fallback={<p>Loading...</p>}>
          <Pagination data={pagination} />
        </Suspense>
      )}
      <ConfirmationDialog
        open={open}
        setOpen={setOpen}
        alertType={alertType}
        onAccept={() =>
          alertType === "delete"
            ? handleDeleteProduct(alertId)
            : console.log("something else")
        }
      />
    </div>
  );
};
