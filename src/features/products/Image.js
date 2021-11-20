import React, { useState, useEffect } from "react";
import axiosInstance from "../../services/Axios";

const Image = ({ imageUrl }) => {
  const [image, setImage] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .get(imageUrl)
      .then((res) => {
        setImage(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [imageUrl]);

  const RenderedElements = () => {
    if (isLoading) {
      return <p>Loading image...</p>;
    }
    return (
      <div>
        <img src={image.image} alt={image.alt_text} style={{ width: 300 }} />
      </div>
    );
  };

  return <RenderedElements />;
};

export default Image;
