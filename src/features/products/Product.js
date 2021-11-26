import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../services/Axios";
// import axios from "axios";
import Image from "./Image";

const Product = ({ productURL }) => {
  const encodedLink = encodeURIComponent(productURL);
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let unmounted = false;
    // const CancelToken = axios.CancelToken;
    // const source = CancelToken.source();
    setIsLoading(true);
    axiosInstance
      .get(productURL, {
        // CancelToken: source.token,
      })
      .then((res) => {
        if (!unmounted) {
          setProduct(res.data);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        if (!unmounted) {
          console.log(error);
          setIsLoading(false);
        }
      });

    return () => {
      // source.cancel("Operation cancelled by the user");
      unmounted = true;
    };
  }, []);

  const Images = () => {
    if (product.images) {
      return <Image imageUrl={product.images[0]} readOnly={true} />;
    }
    return <p>No images</p>;
  };

  const LoadingElement = () => {
    return <p>Product loading...</p>;
  };

  const RenderElement = () => {
    if (isLoading) {
      return <LoadingElement />;
    }
    return (
      <>
        <h4>{product.title}</h4>
        <p>Description: {product.description}</p>
        <p>Regular Price: {product.regular_price}</p>
        <Images />
        <Link to={`/products/${encodedLink}`}>Detail</Link>
      </>
    );
  };

  return (
    <div>
      <RenderElement />
    </div>
  );
};

export default Product;
