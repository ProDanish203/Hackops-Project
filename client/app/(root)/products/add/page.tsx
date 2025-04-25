import { ProductForm } from "@/components/forms";
import { PageTitle } from "@/components/helpers";
import React from "react";

const AddProduct = () => {
  return (
    <section className="section">
      <PageTitle title="Add Product" />
      <ProductForm />
    </section>
  );
};

export default AddProduct;
