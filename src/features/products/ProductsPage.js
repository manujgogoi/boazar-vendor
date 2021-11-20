import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation, Outlet } from "react-router";

const ProductsPage = () => {
  const location = useLocation();
  const { isLoggedIn, status } = useSelector((state) => state.auth);
  const vendorState = useSelector((state) => state.vendor);

  const ActiveVendorElements = () => {
    if (isLoggedIn && vendorState.vendor && !vendorState.vendor.is_active) {
      return (
        <p>
          Your vendor <strong>"{vendorState.vendor.name}"</strong> is not
          active. Please wait for activation or contact administrator.
        </p>
      );
    } else {
      return <Outlet />;
    }
  };

  const RenderedElements = () => {
    if (status === "loading" || vendorState.status === "loading") {
      return <p>Loading...</p>;
    }
    return (
      <div>
        <h1>Products Page</h1>
        {!isLoggedIn && (
          <Navigate to="/login" state={{ from: location }} replace />
        )}
        {isLoggedIn && !vendorState.vendor && (
          <Navigate to="/vendor/create" replace />
        )}
        <ActiveVendorElements />
      </div>
    );
  };

  return <RenderedElements />;
};

export default ProductsPage;
