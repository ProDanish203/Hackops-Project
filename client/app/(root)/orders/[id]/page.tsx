"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader, PageTitle } from "@/components/helpers";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { orderDetailsHeaders } from "@/lib/data";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getOrderById } from "@/API/order.api";
import { IOrder } from "@/types/types";

const OrderTrackPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const {
    data,
    isLoading,
  }: UseQueryResult<
    {
      success: boolean;
      response: IOrder;
    },
    Error
  > = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id),
  });

  return (
    <section className="section">
      {isLoading ? (
        <div className="pt-40">
          <Loader />
        </div>
      ) : data && data.success && data.response ? (
        <>
          <div className="max-sm:flex-col-reverse flex sm:items-center items-start gap-x-3">
            <PageTitle title={`Order #${data.response.trackingNumber}`} />
            <div
              className={cn(
                "text-sm rounded-full capitalize text-text py-1 px-3 font-roboto shadow-sm border ",
                data.response.orderStatus === "pending"
                  ? "bg-blue-500 border-blue-500 text-darkText"
                  : data.response.orderStatus === "completed"
                  ? "bg-green-500 border-green-600"
                  : data.response.orderStatus === "cancelled"
                  ? "bg-red-500 border-red-600 text-darkText"
                  : ""
              )}
            >
              {data.response.orderStatus}
            </div>
          </div>
          {/* Products and Details */}
          <div className="rounded-md bg-neutral-100 dark:bg-neutral-800 py-5 px-4 mt-10">
            <h3 className="text-lg font-semibold">Products Details</h3>
            <Table>
              <TableHeader>
                <TableRow className="dark:hover:bg-neutral-900 dark:border-neutral-600">
                  {orderDetailsHeaders.map(({ name }, idx) => (
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
                {data.response.orderItems.map((item, idx: number) => (
                  <TableRow
                    className="dark:hover:bg-neutral-900 dark:border-neutral-800 overflow-x-hidden"
                    key={idx}
                  >
                    <TableCell className="min-w-[250px] flex items-start gap-x-2">
                      <Image
                        src={item.product.coverImage}
                        alt={item.product.name}
                        width={200}
                        height={200}
                        className="object-cover w-24 rounded-lg h-20"
                      />
                      <div className="py-2">
                        <p className="mb-1 font-medium text-text dark:text-darkText text-[16px]">
                          {item.product.name}
                        </p>
                        <p>
                          Color: <span className="font-medium">Blue</span>
                        </p>
                        <p>
                          Size: <span className="font-medium">42</span>
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="sm:text-lg">${item.price}</TableCell>
                    <TableCell className="sm:text-lg">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="sm:text-lg">
                      ${item.quantity * item.price}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-2 pt-5 flex justify-end border-t border-neutral-300 dark:border-neutral-600">
              <div className="lg:w-[20%] w-full">
                <p className="text-sm text-pretty tracking-wide">
                  Subtotal:{" "}
                  <span className="font-medium">
                    ${data.response.totalAmount}
                  </span>
                </p>
                <p className="text-sm text-pretty tracking-wide">
                  Discount:{" "}
                  <span className="font-medium">
                    ${data.response.discount || 0}
                  </span>
                </p>
                <p className="text-sm text-pretty tracking-wide">
                  Coupon:{" "}
                  <span className="font-medium">
                    {data.response?.couponCode || "N/A"}
                  </span>
                </p>

                <p className="mt-2 pt-2 border-t-2 border-neutral-300 dark:border-neutral-600">
                  Total Bill:{" "}
                  <span className="font-medium">
                    ${data.response.totalAmount}
                  </span>
                </p>
              </div>
            </div>
          </div>
          {/* Customer Details */}
          <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-5 mt-10">
            <div className="md:col-span-2 rounded-md bg-neutral-100 dark:bg-neutral-800 py-5 px-4">
              <h3 className="text-lg font-semibold mb-2">Customer Details</h3>
              <div>
                <p className="text-sm text-pretty tracking-wide">
                  Name:{" "}
                  <span className="font-medium">
                    {data.response?.name || "N/A"}
                  </span>
                </p>
                <p className="text-sm text-pretty tracking-wide">
                  Phone:{" "}
                  <span className="font-medium">
                    {"+" + data.response?.phone || "N/A"}
                  </span>
                </p>
                <p className="text-sm text-pretty tracking-wide">
                  Email:{" "}
                  <span className="font-medium">
                    {data.response?.email || "N/A"}
                  </span>
                </p>
                <p className="text-sm text-pretty tracking-wide">
                  Address:{" "}
                  <span className="font-medium">
                    {data.response?.customer?.address || "N/A"}
                  </span>
                </p>
              </div>
            </div>
            {/* Billing Address */}
            <div className="rounded-md bg-neutral-100 dark:bg-neutral-800 py-5 px-4">
              <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
              <p className="text-sm text-pretty tracking-wide">
                {data.response?.shippingAddress?.street || "N/A"} <br />
                {data.response.shippingAddress.city || "N/A"} <br />
                {data.response.shippingAddress.state || "N/A"}
              </p>
            </div>
            {/* Shipping Address s*/}
            <div className="rounded-md bg-neutral-100 dark:bg-neutral-800 py-5 px-4">
              <h3 className="text-lg font-semibold mb-2">Billing Address</h3>
              <p className="text-sm text-pretty tracking-wide">
                {data.response?.billingAddress?.street || "N/A"} <br />
                {data.response?.billingAddress?.city || "N/A"} <br />
                {data.response?.billingAddress?.state || "N/A"}
              </p>
            </div>
            <div className="rounded-md bg-neutral-100 dark:bg-neutral-800 py-5 px-4">
              <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
              <p className="text-sm text-pretty tracking-wide">
                Method:{" "}
                <span className="font-medium">
                  {data.response?.paymentMethod || "N/A"}
                </span>
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="pt-40 text-center">
          <h1 className="text-3xl font-semibold">Order not found</h1>
        </div>
      )}
    </section>
  );
};

export default OrderTrackPage;
