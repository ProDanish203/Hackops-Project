"use client";
import { getAllOrders } from "@/API/order.api";
import { Filter, PageTitle } from "@/components/helpers";
import { DataTable } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { ordersTableHeaders } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { Suspense } from "react";

interface SearchParams {
  search: string;
  filter: string;
  limit: number;
  page: number;
}

const OrdersPage = ({ searchParams }: { searchParams: SearchParams }) => {
  const { filter, limit, page, search } = searchParams;
  const { data, isLoading } = useQuery({
    queryKey: ["orders", page, search, filter, limit],
    queryFn: () =>
      getAllOrders({
        limit,
        page,
        search,
        status: filter,
      }),
  });

  return (
    <section className="section">
      <PageTitle title="Orders" desc="Track and manage your orders from here" />
      <div className="mt-8">
        <div className="mb-2 bg-neutral-100 dark:bg-neutral-900 rounded-lg py-3 px-5 w-full flex items-center justify-end gap-x-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-primaryCol hover:bg-primaryCol/80 dark:bg-primaryCol dark:hover:bg-primaryCol/80 text-darkText hover:text-darkText center gap-x-2"
          >
            <Download className="size-4" />
            Export
          </Button>
          <Suspense fallback={<p>Loading...</p>}>
            <Filter isOrders />
          </Suspense>
        </div>
        <DataTable
          headers={ordersTableHeaders}
          isOrders
          data={data?.response.data}
          isLoading={isLoading}
          pagination={data?.response.pagination}
        />
      </div>
    </section>
  );
};

export default OrdersPage;
