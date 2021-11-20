import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../features/users/usersSlice";
import productsReducer from "../features/products/productsSlice";
import authReducer from "../features/auth/authSlice";
import vendorReducer from "../features/vendor/vendorSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    products: productsReducer,
    auth: authReducer,
    vendor: vendorReducer,
  },
});
