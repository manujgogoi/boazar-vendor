import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import VendorCreateForm from "./VendorCreateForm";

export const VendorCreatePage = () => {
  const { isLoggedIn, status } = useSelector((state) => state.auth);
  const { vendor } = useSelector((state) => state.vendor);

  const RenderElements = () => {
    if (status === "loading") {
      return <p>Loading...</p>;
    }
    return (
      <div>
        {!isLoggedIn && <Navigate to="/login" replace />}
        {isLoggedIn && vendor && <Navigate to="/dashboard" replace={true} />}
        <p>
          You have not a <strong>vendor</strong>. Please register a vendor.
        </p>
        <VendorCreateForm />
      </div>
    );
  };

  return <RenderElements />;
};
