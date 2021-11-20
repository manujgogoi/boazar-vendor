import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Product from "./Product";

const ProductsList = () => {
  const initialLocalState = Object.freeze({
    isLoading: false,
    products: null,
  });

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
      <h3>Products</h3>
      <RenderElements />
    </div>
  );
};

export default ProductsList;
