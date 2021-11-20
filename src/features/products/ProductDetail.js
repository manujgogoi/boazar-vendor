import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/Axios";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetail = () => {
  const { productUrl } = useParams();
  const [product, setProduct] = useState({});

  useEffect(() => {
    // const CancelToken = axios.CancelToken;
    // const source = CancelToken.source();
    axiosInstance
      .get(productUrl, {
        // CancelToken: source.token,
      })
      .then((res) => setProduct(res.data));

    return () => {
      //   source.cancel("Operation canceled by the user.");
      setProduct({});
    };
  }, [productUrl]);

  return (
    <div>
      <h1>Product Detail</h1>
      {!product ? (
        <p>Product not found</p>
      ) : (
        <div>
          <h2>
            {product.title} <span>#{product.id}</span>
          </h2>
          <p>Description: {product.description}</p>
          <p>Regular Price: {product.regular_price}</p>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
