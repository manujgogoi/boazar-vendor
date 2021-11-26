import React, { useState, useEffect } from "react";
import axiosInstance from "../../services/Axios";

const Specification = ({ specificationURL, parentState, setParentState }) => {
  const [specification, setSpecification] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get Spec from Server
  // ==========================================================
  useEffect(() => {
    console.log(specificationURL);
    let unmounted = false;
    setIsLoading(true);
    axiosInstance
      .get(specificationURL)
      .then((res) => {
        if (!unmounted) {
          setSpecification(res.data);
        }
        setIsLoading(false);
        setError(null);
      })
      .catch((error) => {
        if (!unmounted) {
          setIsLoading(false);
          setError({ error: error.message });
        }
      });

    return () => {
      unmounted = true;
      setSpecification({});
    };
  }, [specificationURL]);

  // ======================================================
  // Event Handlers
  // ======================================================
  const handleDeleteSpecification = (e) => {
    setIsLoading(true);

    // Specification delete server request
    //==================================================
    axiosInstance
      .delete(specificationURL)
      .then((res) => {
        // Update parent state specifications[] (ProductDetail)
        setParentState({
          ...parentState,
          product: {
            ...parentState.product,
            specifications: parentState.product.specifications.filter(
              (spec) => spec !== e.target.value
            ),
          },
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Spec update on delete : ", error);
        setIsLoading(false);
      });
  };

  // ======================================================
  // UI components
  // ======================================================
  const RenderedElements = () => {
    if (isLoading) {
      return <p>Loading specificaiton...</p>;
    }
    return (
      <ul>
        <li>
          {specification.name} : {specification.value}
          <button
            type="button"
            value={specification.url}
            onClick={handleDeleteSpecification}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </li>
      </ul>
    );
  };

  return <RenderedElements />;
};

export default Specification;
