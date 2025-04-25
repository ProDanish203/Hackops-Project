"use client";
import { getSingleProduct } from "@/API/product.api";
import { ProductForm } from "@/components/forms";
import { Loader, PageTitle } from "@/components/helpers";
import { useQuery } from "@tanstack/react-query";

const UodateProduct = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const { data, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getSingleProduct(id),
  });

  return (
    <section className="section">
      <PageTitle title="Update Product" />
      {isLoading ? (
        <div>
          <Loader />
        </div>
      ) : (
        data &&
        data.success &&
        data.response && (
          <ProductForm
            isUpdate
            id={data.response._id}
            productData={data.response}
          />
        )
      )}
    </section>
  );
};

export default UodateProduct;
