import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/Axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import Image from "./Image";
import Specification from "./Specification";
import AddImageForm from "./AddImageForm";
import { useDispatch } from "react-redux";
import { removeProductFromVendorState } from "../vendor/vendorSlice";
import AddSpecificationForm from "./AddSpecificationForm";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productUrl } = useParams();

  const initialLocalState = Object.freeze({
    product: null,
    isLoading: false,
    status: "idle",
    error: null,
  });

  const [localState, setLocalState] = useState(initialLocalState);
  const [productCategory, setProductCategory] = useState(null);

  useEffect(() => {
    setLocalState({
      ...localState,
      isLoading: true,
      status: "pending",
      error: null,
    });

    let unmounted = false;
    axiosInstance
      .get(productUrl)
      .then((res) => {
        if (!unmounted) {
          setLocalState({
            ...localState,
            product: res.data,
            isLoading: false,
            status: "succeeded",
            error: null,
          });
          // ==============================================
          // Get category from the category URL (if available)
          // ==============================================
          if (res.data.category) {
            axiosInstance
              .get(res.data.category)
              .then((res) => {
                if (!unmounted) {
                  setProductCategory(res.data);
                }
              })
              .catch((error) => {
                console.log("Category load error: ", error);
              });
          }
        }
      })
      .catch((error) => {
        if (!unmounted) {
          setLocalState({
            ...localState,
            product: null,
            isLoading: false,
            status: "failed",
            error: error,
          });
        }
      });

    return () => {
      unmounted = true;
      setLocalState({ ...initialLocalState });
    };
  }, [productUrl]);

  // ==============================================
  // Event Handlers
  // ==============================================
  const handleDeleteProduct = () => {
    // Update Local State
    //=============================================
    setLocalState({
      ...localState,
      isLoading: true,
      status: "pending",
      error: null,
    });

    axiosInstance
      .delete(productUrl)
      .then((res) => {
        // Update Local State
        // =======================================
        setLocalState({
          ...localState,
          product: null,
          isLoading: false,
          status: "succeeded",
          error: null,
        });

        // Remove product form vendor state
        // =======================================
        dispatch(removeProductFromVendorState(productUrl));
        // Redirect to ProductsPage
        // =======================================
        navigate("/products");
      })
      .catch((error) => {
        // Update Local State
        // =======================================
        setLocalState({
          ...localState,
          isLoading: false,
          status: "failed",
          error: error,
        });
      });
  };

  // ==============================================
  // Image Components
  // ==============================================
  const Images = () => {
    if (localState.product.images) {
      return localState.product.images.map((imageURL) => (
        <Image
          key={imageURL}
          imageUrl={imageURL}
          readOnly={false}
          parentState={localState}
          setParentState={setLocalState}
        />
      ));
    }
    return <p>No images</p>;
  };

  // ==============================================
  // Specifications
  // ==============================================
  const Specifications = () => {
    if (localState.product.specifications) {
      return localState.product.specifications.map((specificationURL) => (
        <Specification
          key={specificationURL}
          specificationURL={specificationURL}
          readOnly={false}
          parentState={localState}
          setParentState={setLocalState}
        />
      ));
    }
    return "";
  };

  const RenderedElements = () => {
    if (localState.isLoading && !localState.product) {
      return <p>Loading product...</p>;
    }
    if (!localState.isLoading && !localState.product) {
      return <p>Product not found...</p>;
    }
    return (
      <div>
        {localState.error && <p style={{ color: "red" }}>{localState.error}</p>}
        <h2>
          {localState.product.title} <span>#{localState.product.id}</span>
        </h2>
        <p>Category: {productCategory && productCategory.title}</p>
        <p>Description: {localState.product.description}</p>
        <p>Regular Price: {localState.product.regular_price}</p>
        <Images />
        <AddImageForm
          productURL={localState.product.url}
          productState={localState}
          setProductState={setLocalState}
        />
        <Specifications />
        <AddSpecificationForm
          productURL={localState.product.url}
          productState={localState}
          setProductState={setLocalState}
        />
        <Link to={`/products/${encodeURIComponent(productUrl)}/edit`}>
          Edit Product Detail
        </Link>
        <button
          type="button"
          onClick={handleDeleteProduct}
          disabled={localState.isLoading}
        >
          Delete Product
        </button>
      </div>
    );
  };

  return (
    <div>
      <h1>Product Detail</h1>
      <RenderedElements />
    </div>
  );
};

export default ProductDetail;
