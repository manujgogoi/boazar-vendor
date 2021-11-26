import React, { useState } from "react";
import axiosInstance from "../../services/Axios";
import { PRODUCT_IMAGE_URL } from "../../utils/urls";

const AddImageForm = ({ productURL, productState, setProductState }) => {
  const initialLocalState = Object.freeze({
    selectedFile: null,
    progress: null,
    isLoading: false,
    status: "idle",
    error: null,
  });

  const [localState, setLocalState] = useState(initialLocalState);
  const [fileError, setFileError] = useState(null);

  // ============================================
  // Form validation
  // ============================================
  const formValidation = () => {
    if (!localState.selectedFile) {
      setFileError("Please select an image.");
      return false;
    }
    setFileError(null);
    return true;
  };

  // ============================================
  // Handler methods
  // ============================================

  const fileSelectedHandler = (e) => {
    setLocalState({
      ...localState,
      selectedFile: e.target.files[0],
      progress: null,
    });
  };

  const fileUploadHandler = (e) => {
    // Validataion
    if (formValidation()) {
      // Update local state
      setLocalState({
        ...localState,
        isLoading: true,
        status: "pending",
      });

      // Prepare form data to send to server
      const fd = new FormData();
      fd.append("image", localState.selectedFile, localState.selectedFile.name);
      fd.append("alt_text", localState.selectedFile.name);
      fd.append("product", productURL);

      // Server call
      axiosInstance
        .post(PRODUCT_IMAGE_URL, fd, {
          onUploadProgress: (progressEvent) => {
            console.log(
              "Upload Progress : " +
                Math.round((progressEvent.loaded / progressEvent.total) * 100) +
                "%"
            );

            // Update local state's progress
            setLocalState({
              ...localState,
              progress:
                Math.round((progressEvent.loaded / progressEvent.total) * 100) +
                "%",
            });
          },
        })
        .then((res) => {
          // Update local state on success
          setLocalState({
            ...localState,
            selectedFile: null,
            isLoading: false,
            status: "succeeded",
            error: null,
          });

          // Update ProductState of parent(ProductDetail) element
          setProductState({
            ...productState,
            product: {
              ...productState.product,
              images: [res.data.url].concat(productState.product.images),
            },
          });
        })
        .catch((error) => {
          console.log(error);
          // Update local state on Error
          setLocalState({
            ...localState,
            selectedFile: null,
            isLoading: false,
            status: "failed",
            error: error,
          });
        });
    }
  };

  const ProgressElement = () => {
    if (localState.progress) {
      return <div>{localState.progress} complete</div>;
    }
    return "";
  };

  return (
    <div>
      <h1>Add Image Form</h1>
      <form>
        <div>
          <label htmlFor="image-field">Select an image</label>
          <input
            type="file"
            id="image-field"
            name="image"
            onChange={fileSelectedHandler}
          />
          {fileError && <p style={{ color: "red" }}>{fileError}</p>}
        </div>
        <ProgressElement />
        <div>
          <button
            type="button"
            onClick={fileUploadHandler}
            disabled={localState.progress}
          >
            {localState.progress ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddImageForm;
