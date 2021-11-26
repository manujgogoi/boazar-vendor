import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProductToVendorState } from "../vendor/vendorSlice";
import axiosInstance from "../../services/Axios";
import { PRODUCT_URL, CATEGORY_URL } from "../../utils/urls";

const AddProductForm = () => {
  const dispatch = useDispatch();
  const { vendor } = useSelector((state) => state.vendor);
  const [categories, setCategories] = useState([]);

  const initialLocalState = Object.freeze({
    product: null,
    isLoading: false,
    status: "idle",
    error: null,
  });

  const initialFormData = Object.freeze({
    category: null,
    title: "",
    description: "",
    regularPrice: "",
    discountedPrice: "",
    wholesalePrice: "",
    quantity: "",
    wholesaleMinQuantity: "",
    sku: "",
    vendor: "",
    isActive: true,
    isFeatured: false,
    isDownloadable: false,
  });

  const initialFieldError = Object.freeze({
    title: "",
    description: "",
    regularPrice: "",
    discountedPrice: "",
    wholesalePrice: "",
    quantity: "",
    wholesaleMinQuantity: "",
    sku: "",
    vendor: "",
    isActive: "",
    isFeatured: "",
    isDownloadable: "",
  });

  const [localState, setLocalState] = useState(initialLocalState);
  const [formData, setFormData] = useState(initialFormData);
  const [fieldError, setFieldError] = useState(initialFieldError);

  // Load Category data from server
  useEffect(() => {
    let unmounted = false;
    axiosInstance
      .get(CATEGORY_URL)
      .then((res) => {
        if (!unmounted) {
          setCategories(res.data);
        }
      })
      .catch((error) => {
        console.log("Category : ", error);
      });
    return () => {
      unmounted = true;
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleCheckBox = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked,
    });
  };

  //================================================
  // Form Validation
  //================================================
  const validateFormData = () => {
    const numFieldRegex = /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/;

    // Sanitize formData
    setFormData({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      regularPrice: formData.regularPrice.trim(),
      discountedPrice: formData.discountedPrice.trim(),
      wholesalePrice: formData.wholesalePrice.trim(),
      quantity: formData.quantity.trim(),
      wholesaleMinQuantity: formData.wholesaleMinQuantity.trim(),
      sku: formData.sku.trim(),
    });

    if (formData.category === "0") {
      setFormData({
        ...formData,
        category: null,
      });
    }
    if (formData.title === "") {
      setFieldError({
        ...initialFieldError,
        title: "Please enter a title of the product.",
      });
      return false;
    } else if (formData.regularPrice === "") {
      setFieldError({
        ...initialFieldError,
        regularPrice: "Please enter regular price of the product.",
      });
      return false;
    } else if (!numFieldRegex.test(formData.regularPrice)) {
      setFieldError({
        ...initialFieldError,
        regularPrice: "Invalid Price.",
      });
      return false;
    } else if (
      formData.discountedPrice &&
      !numFieldRegex.test(formData.discountedPrice)
    ) {
      setFieldError({
        ...initialFieldError,
        discountedPrice: "Invalid Price",
      });
      return false;
    } else if (
      formData.wholesalePrice &&
      !numFieldRegex.test(formData.wholesalePrice)
    ) {
      setFieldError({
        ...initialFieldError,
        wholesalePrice: "Invalid Price",
      });
      return false;
    } else if (formData.quantity && !numFieldRegex.test(formData.quantity)) {
      setFieldError({
        ...initialFieldError,
        quantity: "Invalid Quantity",
      });
      return false;
    } else if (
      formData.wholesaleMinQuantity &&
      !numFieldRegex.test(formData.wholesaleMinQuantity)
    ) {
      setFieldError({
        ...initialFieldError,
        wholesaleMinQuantity: "Invalid Quantity",
      });
      return false;
    }

    setFieldError({
      ...initialFieldError,
    });
    return true;
  };

  //================================================
  // Form Submit
  //================================================
  const handleSubmit = (e) => {
    setLocalState({
      ...localState,
      product: null,
      isLoading: true,
      status: "pending",
      error: null,
    });
    e.preventDefault();
    if (validateFormData()) {
      if (vendor) {
        // Prepare form data for sending
        // ==========================================
        let data = {
          title: formData.title,
          description: formData.description,
          regular_price: formData.regularPrice,
          discount_price: formData.discountedPrice,
          wholesale_price: formData.wholesalePrice,
          quantity: parseInt(formData.quantity),
          wholesale_min_quantity: parseInt(formData.wholesaleMinQuantity),
          sku: formData.sku,
          is_active: formData.isActive,
          is_featured: formData.isFeatured,
          is_downloadable: formData.isDownloadable,
        };

        // Add Category if selected
        if (formData.category) {
          data = {
            ...data,
            category: formData.category,
          };
        }

        // Server call to add product
        //==============================================
        axiosInstance
          .post(PRODUCT_URL, data)
          .then((res) => {
            setLocalState({
              ...localState,
              product: res.data,
              isLoading: false,
              status: "succeeded",
              error: null,
            });

            // Update vendor products
            dispatch(addProductToVendorState(res.data.url)); // only add url of the product
          })
          .catch((err) => {
            setLocalState({
              ...localState,
              isLoading: false,
              status: "failed",
              error: err,
            });
          });
      } else {
        setLocalState({
          ...localState,
          isLoading: false,
          status: "failed",
          error: { error: "Vendor error" },
        });
      }
    } else {
      setLocalState({
        ...localState,
        isLoading: false,
        status: "failed",
        error: { error: "Validation error" },
      });
      return false;
    }
  };

  return (
    <div>
      <h3>Add Product</h3>
      <form>
        <div>
          <label htmlFor="category">Product Category </label>
          <select
            id="category"
            defaultValue={0}
            name="category"
            onChange={handleChange}
          >
            <option value={0}>No Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.url}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="title">Title * </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <p style={{ color: "red" }}>{fieldError.title && fieldError.title}</p>
        </div>
        <div>
          <label htmlFor="description">Product Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label htmlFor="regular-price">Regular Price * </label>
          <input
            type="text"
            id="regular-price"
            name="regularPrice"
            value={formData.regularPrice}
            onChange={handleChange}
          />
          <p style={{ color: "red" }}>
            {fieldError.regularPrice && fieldError.regularPrice}
          </p>
        </div>
        <div>
          <label htmlFor="discounted-price">Discounted Price</label>
          <input
            type="text"
            id="discounted-price"
            name="discountedPrice"
            value={formData.discountedPrice}
            onChange={handleChange}
          />
          <p style={{ color: "red" }}>
            {fieldError.discountedPrice && fieldError.discountedPrice}
          </p>
        </div>
        <div>
          <label htmlFor="wholesale-price">Wholesale Price</label>
          <input
            type="text"
            id="wholesale-price"
            name="wholesalePrice"
            value={formData.wholesalePrice}
            onChange={handleChange}
          />
          <p style={{ color: "red" }}>
            {fieldError.wholesalePrice && fieldError.wholesalePrice}
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
            name="wholesaleMinQuantity"
            value={formData.wholesaleMinQuantity}
            onChange={handleChange}
          />
          <p style={{ color: "red" }}>
            {fieldError.wholesaleMinQuantity && fieldError.wholesaleMinQuantity}
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
            name="isActive"
            defaultChecked={formData.isActive}
            onChange={toggleCheckBox}
          />
        </div>
        <div>
          <label htmlFor="is-featured">Is Featured</label>
          <input
            type="checkbox"
            id="is-featured"
            name="isFeatured"
            defaultChecked={false}
            onChange={toggleCheckBox}
          />
        </div>
        <div>
          <label htmlFor="is-downloadable">Is Product Downloadable</label>
          <input
            type="checkbox"
            id="is-downloadable"
            name="isDownloadable"
            defaultChecked={false}
            onChange={toggleCheckBox}
          />
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

export default AddProductForm;
