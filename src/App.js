import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Typography from "@mui/material/Typography";

// pages for routes
import HomePage from "./features/home/HomePage";
import DashboardPage from "./features/Dashboard/DashboardPage";

import ProductsPage from "./features/products/ProductsPage";
import ProductsList from "./features/products/ProductsList";
import ProductDetail from "./features/products/ProductDetail";
import ProductEditForm from "./features/products/ProductEditForm";

import { CreateUserForm } from "./features/users/CreateUserForm";

import { LoginForm } from "./features/auth/LoginForm";
import { VendorCreatePage } from "./features/vendor/VendorCreatePage";

import { useDispatch, useSelector } from "react-redux";
import { updateLoginStatus } from "./features/auth/authSlice";
import { updateUserVendorAsync } from "./features/vendor/vendorSlice";

import Navbar from "./app/Navbar";

function App() {
  const { userId, isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Update User login state;
  useEffect(() => {
    dispatch(updateLoginStatus());
  }, []);

  // Update User vendor state
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(updateUserVendorAsync(userId));
    }
  }, [userId]);

  return (
    <BrowserRouter>
      <div className="App">
        <Typography variant="h1">My App</Typography>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="register" element={<CreateUserForm />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="vendor/create" element={<VendorCreatePage />} />
          <Route path="products" element={<ProductsPage />}>
            <Route path="" element={<ProductsList />} />
            <Route path=":productUrl" element={<ProductDetail />} />
            <Route path=":productUrl/edit" element={<ProductEditForm />} />
          </Route>
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There's nothing here!</p>
              </main>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
