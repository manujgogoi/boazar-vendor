import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { vendorRegisterAsync, updateUserVendorAsync } from "./vendorSlice";
import { updateLoginStatus } from "../auth/authSlice";

const VendorCreateForm = () => {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.auth);

  const initialLocalState = Object.freeze({
    isLoading: false,
    error: null,
  });

  const [vendorName, setVendorName] = useState("");
  const [vendorNameFieldError, setVendorNameFieldError] = useState("");
  const [localState, setLocalState] = useState(initialLocalState);

  const handleVendorNameChange = (e) => {
    setVendorName(e.target.value);
  };

  const validateFormData = () => {
    if (vendorName === "") {
      setVendorNameFieldError("Please enter a name");
      return false;
    }
    setVendorNameFieldError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Update local state object
    setLocalState({
      ...localState,
      isLoading: true,
      error: null,
    });

    if (validateFormData()) {
      dispatch(updateLoginStatus);
      dispatch(vendorRegisterAsync(vendorName))
        .unwrap()
        .then((res) => {
          if (userId) {
            dispatch(updateUserVendorAsync(userId));
          }
        })
        .catch((error) => {
          // Update local state object
          setLocalState({
            ...localState,
            isLoading: false,
            error: error,
          });
        });
      return true;
    }
    return false;
  };

  const ResponseError = () => {
    if (localState.error) {
      return Object.keys(localState.error).map((keyName, i) => (
        <li key={i}>
          {keyName} :
          {typeof keyName === "string"
            ? localState.error[keyName]
            : localState.error[keyName][0]}
        </li>
      ));
    }
    return "";
  };

  return (
    <div>
      <div>
        <h1>Vendor Register Form</h1>
        <ul>
          <ResponseError />
        </ul>
        <form>
          <div>
            <label htmlFor="name">Vendor Name: </label>
            <input
              type="text"
              id="name"
              name="name"
              value={vendorName}
              onChange={handleVendorNameChange}
            />
            {vendorNameFieldError && (
              <p style={{ color: "red" }}>{vendorNameFieldError}</p>
            )}
          </div>
          <button type="submit" onClick={handleSubmit}>
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default VendorCreateForm;
