import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import axiosInstance from "../../services/Axios";
import { USER_URL } from "../../utils/urls";

export const CreateUserForm = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  const initialLocalState = Object.freeze({
    user: null,
    isLoading: false,
    status: "idle",
    error: null,
  });

  const initialFormData = Object.freeze({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const initialFieldError = Object.freeze({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [localState, setLocalState] = useState(initialLocalState);
  const [formData, updateFormData] = useState(initialFormData);
  const [fieldError, updateFieldError] = useState(initialFieldError);

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      // Trimming any whitespaces
      [e.target.name]: e.target.value.trim(),
    });
  };

  const validateFormData = () => {
    if (formData.email === "") {
      updateFieldError({
        ...fieldError,
        email: "Email field is blank",
      });
      return false;
    } else if (formData.password === "") {
      updateFieldError({
        ...fieldError,
        email: "",
        password: "Password field is blank",
      });
      return false;
    } else if (formData.confirmPassword !== formData.password) {
      updateFieldError({
        ...fieldError,
        email: "",
        password: "",
        confirmPassword: "Password mismatched",
      });
      return false;
    }
    updateFieldError({
      ...fieldError,
      email: "",
      passwod: "",
      confirmPassword: "",
    });
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFormData()) {
      // Update local state
      setLocalState({
        ...localState,
        isLoading: true,
        status: "pending",
      });
      // Server create an user call with custom Axios
      axiosInstance
        .post(USER_URL, {
          email: formData.email,
          password: formData.password,
        })
        .then((res) => {
          // Update local State
          setLocalState({
            ...localState,
            user: res.data,
            isLoading: false,
            status: "succeeded",
            error: null,
          });

          // Reset form fields
          updateFormData({ ...initialFormData });
        })
        .catch((err) => {
          console.log(err.response.data);

          // Update local state
          setLocalState({
            ...localState,
            user: null,
            isLoading: false,
            status: "failed",
            error: err.response.data,
          });
        });
    }
    return false;
  };

  const ErrorElement = () => {
    if (localState.error) {
      return Object.keys(localState.error).map((keyName, i) => (
        <li key={i}>
          {keyName} :
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
      {isLoggedIn && <Navigate to="/dashboard" replace={true} />}
      {localState.status === "succeeded" && localState.user && (
        <p>
          User ({localState.user.email}) is created successfully.{" "}
          <Link to="/login">Click to Login</Link>
        </p>
      )}
      <h3>Register New user</h3>
      <ul>
        <ErrorElement />
      </ul>
      <form>
        <div>
          <label htmlFor="email">Email: </label>
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
          <label htmlFor="confirmPassword">Confirm Password: </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {fieldError.confirmPassword && (
            <p style={{ color: "red" }}>{fieldError.confirmPassword}</p>
          )}
        </div>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={localState.isLoading}
        >
          {localState.isLoading ? "Loading..." : "Register"}
        </button>
      </form>
    </div>
  );
};
