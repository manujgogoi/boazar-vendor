import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import axiosInstance from "../../services/Axios";
import { USER_URL } from "../../utils/urls";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

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
          let error = "";
          // Update local state
          if (!err.response) {
            error = "Network / Server error";
          } else if (err.response.status === 400) {
            error = err.response.data.email;
          } else {
            error = "Some error occured";
          }
          // Flashing error as a toast
          toast.error(<span>{error}</span>, { theme: "colored" });
          setLocalState({
            ...localState,
            user: null,
            isLoading: false,
            status: "failed",
            error: error,
          });
        });
    }
    return false;
  };

  return (
    <div>
      {isLoggedIn && <Navigate to="/dashboard" replace={true} />}
      {localState.status === "succeeded" && localState.user && (
        <p>
          User ({localState.user.email}) is created successfully.
          <Link to="/login">Click to Login</Link>
        </p>
      )}
      <h3>Register New user</h3>
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
