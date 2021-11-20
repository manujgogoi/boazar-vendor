import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

import { userLoginAsync } from "./authSlice";
import { updateUserVendorAsync } from "../vendor/vendorSlice";

export const LoginForm = () => {
  // Location handling
  let location = useLocation();
  let { from } = location.state || { from: { pathname: "/dashboard" } };

  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector((state) => state.auth);

  const initialLocalState = Object.freeze({
    isLoading: false,
    error: null,
  });

  const initialFormData = Object.freeze({
    email: "",
    password: "",
  });

  const initialFieldError = Object.freeze({
    email: "",
    password: "",
  });
  const [formData, updateFormData] = useState(initialFormData);
  const [fieldError, setFieldError] = useState(initialFieldError);
  const [localState, setLocalState] = useState(initialLocalState);

  const validateFormField = () => {
    if (formData.email === "") {
      setFieldError({
        ...fieldError,
        email: "Please enter your email id",
      });
      return false;
    } else if (formData.password === "") {
      setFieldError({
        ...fieldError,
        email: "",
        password: "Please enter your valid password",
      });
      return false;
    }
    setFieldError({
      ...fieldError,
      email: "",
      password: "",
    });
    return true;
  };

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      // Trimming any whitespaces
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFormField()) {
      // Update Local State object
      setLocalState({
        ...localState,
        isLoading: true,
        error: null,
      });

      dispatch(userLoginAsync(formData))
        .unwrap()
        .then((res) => {
          // Update Vendor Store after successfull login
          const tokenParts = JSON.parse(atob(res.access.split(".")[1]));
          const userId = tokenParts.user_id;
          dispatch(updateUserVendorAsync(userId));
        })
        .catch((error) => {
          setLocalState({
            ...localState,
            isLoading: false,
            error: error,
          });
        });
    }
    return false;
  };

  const ErrorElement = () => {
    if (localState.error) {
      return Object.keys(localState.error).map((keyName, i) => (
        <li key={i}>
          {keyName} :{" "}
          {typeof keyName == "string"
            ? localState.error[keyName]
            : localState.error[keyName][i]}
        </li>
      ));
    }
    return "";
  };

  return (
    <div>
      {isLoggedIn && <Navigate to={from.pathname} replace />}
      <h3>Login user</h3>
      <ErrorElement />
      <form>
        <div>
          <label htmlFor="email">Email :</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {fieldError.email && (
            <p style={{ color: "red" }}>{fieldError.email}</p>
          )}
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {fieldError.password && (
            <p style={{ color: "red" }}>{fieldError.password}</p>
          )}
        </div>
        <div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={localState.isLoading}
          >
            {localState.isLoading ? "Loading..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};
