import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../services/Axios";
import Image from "./Image";

const Product = ({ productURL }) => {
  const encodedLink = encodeURIComponent(productURL);
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .get(productURL)
      .then((res) => {
        setProduct(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [productURL]);

  const Images = () => {
    if (product.images) {
      return product.images.map((imageURL) => (
        <Image key={imageURL} imageUrl={imageURL} />
      ));
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
