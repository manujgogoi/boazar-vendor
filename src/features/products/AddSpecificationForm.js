import React, { useState, useEffect } from "react";
import axiosInstance from "../../services/Axios";
import { SPECIFICATION_URL } from "../../utils/urls";

const AddSpecificationForm = ({
  productURL,
  productState,
  setProductState,
}) => {
  //=====================================================
  // Local State
  //=====================================================
  const initialLocalState = {
    specification: null,
    isLoading: false,
    status: "idle",
    error: null,
  };
  const [localState, setLocalState] = useState(initialLocalState);

  //=====================================================
  // Form data
  //=====================================================
  const initialFormData = {
    name: "",
    value: "",
    product: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  const initialFieldError = {
    name: "",
    value: "",
  };
  const [fieldError, setFieldError] = useState(initialFieldError);

  //=====================================================
  // Side Effects
  //=====================================================
  // Store productURL to FormData
  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      setFormData({
        ...formData,
        product: productURL,
      });
    }
    return () => {
      unmounted = true;
    };
  }, [productURL]);
  //=====================================================
  // Form Validation
  //=====================================================
  const validateFormData = () => {
    if (formData.name.trim() === "") {
      setFieldError({
        ...initialFieldError,
        name: "Please enter a spec name",
      });
      return false;
    } else if (formData.value.trim() === "") {
      setFieldError({
        ...initialFieldError,
        value: "Please enter a value",
      });
      return false;
    }

    // Reset Field Error
    setFieldError({
      ...initialFieldError,
    });
    return true;
  };
  //=====================================================
  // Event handlers
  //=====================================================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateFormData()) {
      // Submit the Form
      //==============================================

      setLocalState({
        ...localState,
        isLoading: true,
        status: "pending",
        error: null,
      });

      axiosInstance
        .post(SPECIFICATION_URL, formData)
        .then((res) => {
          setLocalState({
            ...localState,
            specification: res.data,
            isLoading: false,
            status: "succeeded",
            error: null,
          });

          // Update ProductState of Parent(ProductDetail) element
          setProductState({
            ...productState,
            product: {
              ...productState.product,
              specifications: [res.data.url].concat(
                productState.product.specifications
              ),
            },
          });

          setFormData({
            ...initialFormData,
          });
        })
        .catch((error) => {
          setLocalState({
            ...localState,
            specification: null,
            isLoading: false,
            status: "failed",
            error: { Error: error.message },
          });
        });
    }
  };

  //====================================================
  // Child Components
  //====================================================
  const FormError = () => {
    if (localState.error) {
      // return JSON.stringify(localState.error);
      return Object.keys(localState.error).map((keyName, i) => (
        <li key={i}>
          {keyName} :
          {typeof keyName === "string"
            ? localState.error[keyName]
            : localState.error[keyName][i]}
        </li>
      ));
    }
    return "";
  };

  return (
    <div>
      <h1>Add Specification</h1>
      <form>
        <FormError />
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
          />
          {fieldError.name && <p style={{ color: "red" }}>{fieldError.name}</p>}
        </div>
        <div>
          <label htmlFor="value">Value:</label>
          <input
            type="text"
            name="value"
            id="value"
            value={formData.value}
            onChange={handleChange}
          />
          {fieldError.value && (
            <p style={{ color: "red" }}>{fieldError.value}</p>
          )}
        </div>
        <div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={localState.isLoading}
          >
            {localState.isLoading ? "Loading..." : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSpecificationForm;
