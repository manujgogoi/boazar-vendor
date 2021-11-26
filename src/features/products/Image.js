import React, { useState, useEffect } from "react";
import axiosInstance from "../../services/Axios";

const Image = ({ imageUrl, readOnly, parentState, setParentState }) => {
  const [image, setImage] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Get Image from Server
  // =======================================================
  useEffect(() => {
    let unmounted = false;
    setIsLoading(true);
    axiosInstance
      .get(imageUrl)
      .then((res) => {
        if (!unmounted) {
          setImage(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        if (!unmounted) {
          console.log(error);
          setIsLoading(false);
        }
      });

    return () => {
      unmounted = true;
      setImage({});
    };
  }, [imageUrl]);

  // Event Handlers
  //==================================================
  const handleDeleteImage = (e) => {
    setIsLoading(true);

    // image delete server request
    //================================================
    axiosInstance
      .delete(imageUrl)
      .then((res) => {
        // Update parent state images[] (ProductDetail)
        setParentState({
          ...parentState,
          product: {
            ...parentState.product,
            images: parentState.product.images.filter(
              (image) => image !== e.target.value
            ),
          },
        });

        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const RenderedElements = () => {
    if (isLoading) {
      return <p>Loading image...</p>;
    }
    return (
      <div>
        <img src={image.image} alt={image.alt_text} style={{ width: 300 }} />
        {!readOnly ? (
          <button
            type="button"
            value={image.url}
            onClick={handleDeleteImage}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        ) : (
          ""
        )}
      </div>
    );
  };

  return <RenderedElements />;
};

export default Image;
