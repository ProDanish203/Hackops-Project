"use client";
import { getAllProducts } from "@/API/product.api";
import { Filter, PageTitle } from "@/components/helpers";
import { DataTable } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { productTableHeaders } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

interface SearchParams {
  search: string;
  filter: string;
  limit: number;
  page: number;
}

const ProductsPage = ({ searchParams }: { searchParams: SearchParams }) => {
  const { filter, limit, page, search } = searchParams;
  const { data, isLoading } = useQuery({
    queryKey: ["products", page, search, filter, limit],
    queryFn: () =>
      getAllProducts({
        limit,
        page,
        search,
        filter,
      }),
  });
  return (
    <section className="section">
      <div className="flex sm:items-center justify-between max-sm:flex-col w-full gap-x-5 gap-y-2">
        <PageTitle
          title="Products"
          desc="Manage all your products from this page, add new products, update existing products and delete products"
        />
      </div>
      <div className="mt-8">
        <div className="mb-2 bg-neutral-100 dark:bg-neutral-900 rounded-lg py-3 px-5 w-full flex items-center justify-end gap-x-2">
          <Link href="/products/add" aria-label="Add Product">
            <Button
              variant="outline"
              className="bg-primaryCol hover:bg-primaryCol/80 dark:bg-primaryCol dark:hover:bg-primaryCol/80 text-darkText hover:text-darkText center gap-x-2"
              size="sm"
            >
              <Plus className="size-5" />
              Add Product
            </Button>
          </Link>
          <Suspense fallback={<p>Loading...</p>}>
            <Filter />
          </Suspense>
        </div>
        <DataTable
          headers={productTableHeaders}
          isProduct
          data={data?.response.data}
          isLoading={isLoading}
          pagination={data?.response.pagination}
        />
      </div>
    </section>
  );
};

export default ProductsPage;
