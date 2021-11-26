import React from "react";
import { useSelector } from "react-redux";
import Product from "./Product";
import AddProductForm from "./AddProductForm";

const ProductsList = () => {
  const { vendor, status } = useSelector((state) => state.vendor);

  const RenderElements = () => {
    if (status === "loading") {
      return <p>Loading products ...</p>;
    } else if (vendor) {
      if (vendor.products) {
        return vendor.products.map((productURL) => (
          <Product key={productURL} productURL={productURL} />
        ));
      }
    }
    return <p>No Products available</p>;
  };

  return (
    <div>
      <AddProductForm />
      <h3>Product List</h3>
      <RenderElements />
    </div>
  );
};

export default ProductsList;
