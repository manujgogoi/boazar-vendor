import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../services/Axios";
import { CATEGORY_URL, PRODUCT_URL } from "../../utils/urls";

const ProductEditForm = () => {
  const { vendor } = useSelector((state) => state.vendor);
  const { productUrl } = useParams();
  const encodedLink = encodeURIComponent(productUrl);

  // ========================================================
  // Local State
  // ========================================================
  const initialLocalState = Object.freeze({
    product: {},
    isLoading: false,
    isUpdating: false,
    updateStatus: "",
    status: "idle",
    error: null,
  });

  const [localState, setLocalState] = useState(initialLocalState);
  const [category, setCategory] = useState(null);
  const [categoryList, setCategoryList] = useState(null);
  const [loadingCategoryList, setLoadingCategoryList] = useState(false);

  // ========================================================
  // Form Data
  // ========================================================
  const initialFormData = Object.freeze({
    category: "",
    title: "",
    description: "",
    regular_price: "",
    discount_price: "",
    wholesale_price: "",
    quantity: "",
    wholesale_min_quantity: "",
    sku: "",
    is_active: true,
    is_featured: false,
    is_downloadable: false,
  });
  const [formData, setFormData] = useState(initialFormData);

  // ========================================================
  // Form Field Error data
  // ========================================================
  const initialFieldError = Object.freeze({
    title: "",
    description: "",
    regular_price: "",
    discount_price: "",
    wholesale_price: "",
    quantity: "",
    wholesale_min_quantity: "",
    sku: "",
  });
  const [fieldError, setFieldError] = useState(initialFieldError);

  // ========================================================
  // Side Effects to load Product and Product Category (if any)
  // ========================================================
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
                  setCategory(res.data);
                }
              })
              .catch((error) => {
                console.log("Category load error: ", error);
              });
          }

          // ==============================================
          // Set products to FormData
          // ==============================================
          console.log(res.data);
          setFormData({
            ...initialFormData,
            category: res.data.category || 0,
            title: res.data.title || "",
            description: res.data.description || "",
            regular_price: res.data.regular_price || "",
            discount_price: res.data.discount_price || "",
            wholesale_price: res.data.wholesale_price || "",
            quantity: res.data.quantity || "",
            wholesale_min_quantity: res.data.wholesale_min_quantity || "",
            sku: res.data.sku || "",
            is_active: res.data.is_active,
            is_featured: res.data.is_featured,
            is_downloadable: res.data.is_downloadable,
          });
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
    };
  }, [productUrl]);

  // ========================================================
  // Side Effects to load Category List
  // ========================================================
  useEffect(() => {
    // setLoadingCategoryList(true);
    let unmounted = false;
    axiosInstance
      .get(CATEGORY_URL)
      .then((res) => {
        if (!unmounted) {
          setCategoryList(res.data);
          setLoadingCategoryList(false);
        }
      })
      .catch((error) => {
        console.log("Category : ", error);
      });
    return () => {
      unmounted = true;
      setLoadingCategoryList(false);
    };
  }, []);

  //================================================
  // Form Validation
  //================================================
  const validateFormData = () => {
    const numFieldRegex = /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/;

    if (formData.category === 0) {
      setFormData({
        ...formData,
        category: null,
      });
    }

    if (formData.title === "") {
      setFieldError({
        ...initialFieldError,
        title: "Please enter a title",
      });
      return false;
    } else if (formData.regular_price === "") {
      setFieldError({
        ...initialFieldError,
        regular_price: "Please enter regular price",
      });
      return false;
    } else if (!numFieldRegex.test(formData.regular_price)) {
      setFieldError({
        ...initialFieldError,
        regular_price: "Invalid Price",
      });
      return false;
    } else if (
      formData.discount_price &&
      !numFieldRegex.test(formData.discount_price)
    ) {
      setFieldError({
        ...initialFieldError,
        discount_price: "Invalid Price",
      });
      return false;
    } else if (
      formData.wholesale_price &&
      !numFieldRegex.test(formData.wholesale_price)
    ) {
      setFieldError({
        ...initialFieldError,
        wholesale_price: "Invalid Price",
      });
      return false;
    } else if (formData.quantity && !numFieldRegex.test(formData.quantity)) {
      setFieldError({
        ...initialFieldError,
        quantity: "Invalid Quantity",
      });
      return false;
    } else if (
      formData.wholesale_min_quantity &&
      !numFieldRegex.test(formData.wholesale_min_quantity)
    ) {
      setFieldError({
        ...initialFieldError,
        wholesale_min_quantity: "Invalid Quantity",
      });
      return false;
    }

    setFieldError({
      ...initialFieldError,
    });

    // Format Form Data
    // =====================================================
    if (formData.quantity) {
      setFormData({
        ...formData,
        quantity: parseInt(formData.quantity),
      });
    }

    if (formData.wholesale_min_quantity) {
      setFormData({
        ...formData,
        wholesale_min_quantity: parseInt(formData.wholesale_min_quantity),
      });
    }

    return true;
  };

  // ========================================================
  // Event Handlers
  // ========================================================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleCheckBox = (e) => {
    console.log(e.target.checked);
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalState({
      ...localState,
      isUpdating: true,
      status: "pending",
      error: null,
    });

    if (validateFormData()) {
      // Prepare payload
      // ==============================================
      let payload = {
        title: formData.title,
        description: formData.description,
        regular_price: formData.regular_price,
        discount_price: formData.discount_price,
        wholesale_price: formData.wholesale_price,
        sku: formData.sku,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        is_downloadable: formData.is_downloadable,
      };

      if (formData.category !== "0") {
        payload = {
          ...payload,
          category: formData.category,
        };
      }

      if (formData.quantity) {
        payload = {
          ...payload,
          quantity: formData.quantity,
        };
      }

      if (formData.wholesale_min_quantity) {
        payload = {
          ...payload,
          wholesale_min_quantity: formData.wholesale_min_quantity,
        };
      }

      if (vendor) {
        // Server call to update product
        //==================================================
        axiosInstance
          .put(`${PRODUCT_URL}${localState.product.id}/`, payload)
          .then((res) => {
            console.log(res.data);
            setLocalState({
              ...localState,
              product: res.data,
            });
          })
          .then(() => {
            setLocalState({
              ...localState,
              isUpdating: false,
              updateStatus: "Product updated successfully",
              status: "succeeded",
              error: null,
            });
          })
          .catch((error) => {
            console.log(error);
            setLocalState({
              ...localState,
              isUpdating: false,
              updateStatus: "Update error",
              status: "failed",
              error: { error: error.message },
            });
          });
      } else {
        setLocalState({
          ...localState,
          isUpdating: false,
          updateStatus: "Update error",
          status: "failed",
          error: { error: "Vendor error" },
        });
      }
    }

    setLocalState({
      ...localState,
      isUpdating: false,
    });

    return false;
  };

  // ========================================================
  // UI Elements
  // ========================================================

  return (
    <div>
      <h1>Edit Product</h1>
      {localState.isLoading ? (
        <p>Loading product...</p>
      ) : !localState.isLoading && !localState.product ? (
        <p>Product not found</p>
      ) : (
        <div>
          {localState.updateStatus && (
            <div>
              <p>{localState.updateStatus}</p>
              <button
                onClick={() =>
                  setLocalState({ ...localState, updateStatus: "" })
                }
              >
                Close
              </button>
            </div>
          )}
          <form>
            <p>Product Id : # {localState.product.id}</p>
            <div>
              <label htmlFor="category">Category </label>
              {loadingCategoryList ? (
                "Loading Category..."
              ) : (
                <select
                  id="category"
                  name="category"
                  defaultValue={
                    (localState.product.category &&
                      localState.product.category) ||
                    0
                  }
                  onChange={handleChange}
                >
                  <option value={0}>No Category</option>
                  {categoryList &&
                    categoryList.map((cat) => (
                      <option key={cat.id} value={cat.url}>
                        {cat.title}
                      </option>
                    ))}
                </select>
              )}
            </div>
            <div>
              <label htmlFor="title">Title </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
              {fieldError.title && (
                <p style={{ color: "red" }}>{fieldError.title}</p>
              )}
            </div>
            <div>
              <label htmlFor="description">Description </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
            <div>
              <label htmlFor="regular-price">Regular Price </label>
              <input
                type="text"
                id="regular-price"
                name="regular_price"
                value={formData.regular_price}
                onChange={handleChange}
              />
              {fieldError.regular_price && (
                <p style={{ color: "red" }}>{fieldError.regular_price}</p>
              )}
            </div>
            <div>
              <label htmlFor="discount-price">Discount Price</label>
              <input
                type="text"
                id="discount-price"
                name="discount_price"
                value={formData.discount_price}
                onChange={handleChange}
              />
              <p style={{ color: "red" }}>
                {fieldError.discount_price && fieldError.discount_price}
              </p>
            </div>
            <div>
              <label htmlFor="wholesale-price">Wholesale Price</label>
              <input
                type="text"
                id="wholesale-price"
                name="wholesale_price"
                value={formData.wholesale_price}
                onChange={handleChange}
              />
              <p style={{ color: "red" }}>
                {fieldError.wholesale_price && fieldError.wholesale_price}
              </p>
            </div>
            <div>
              <label htmlFor="quantity">Quantity</label>
              <input
                type="text"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
              />
              <p style={{ color: "red" }}>
                {fieldError.quantity && fieldError.quantity}
              </p>
            </div>
            <div>
              <label htmlFor="wholesale-min-quantity">
                Wholesale minimum quantity
              </label>
              <input
                type="text"
                id="wholesale-min-quantity"
                name="wholesale_min_quantity"
                value={formData.wholesale_min_quantity}
                onChange={handleChange}
              />
              <p style={{ color: "red" }}>
                {fieldError.wholesale_min_quantity &&
                  fieldError.wholesale_min_quantity}
              </p>
            </div>
            <div>
              <label htmlFor="sku">Stock Keeping Unit</label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="is-active">Is Product Active</label>
              <input
                type="checkbox"
                id="is-active"
                name="is_active"
                checked={formData.is_active}
                onChange={toggleCheckBox}
              />
            </div>
            <div>
              <label htmlFor="is-featured">Is Featured</label>
              <input
                type="checkbox"
                id="is-featured"
                name="is_featured"
                checked={formData.is_featured}
                onChange={toggleCheckBox}
              />
            </div>
            <div>
              <label htmlFor="is-downloadable">Is Product Downloadable</label>
              <input
                type="checkbox"
                id="is-downloadable"
                name="is_downloadable"
                checked={formData.is_downloadable}
                onChange={toggleCheckBox}
              />
            </div>
            <div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={localState.isUpdating}
              >
                {localState.isUpdating ? "Updating..." : "Update"}
              </button>
              <Link to={`/products/${encodedLink}`}>Go back to detail</Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductEditForm;
