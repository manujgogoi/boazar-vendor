import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/Axios";
import { loginAPI } from "./authAPI";

const initialState = {
  userId: null,
  isLoggedIn: false,
  status: "idle",
};

export const userLoginAsync = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    // thunkAPI.rejectWithValue is used to provide custom payload in rejected action
    try {
      const response = await loginAPI(formData.email, formData.password);
      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      state.userId = null;
      state.isLoggedIn = false;
    },
    updateLoginStatus: (state) => {
      state.status = "loading";
      const refreshToken = localStorage.getItem("refresh_token")
        ? localStorage.getItem("refresh_token")
        : null;
      if (refreshToken) {
        const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]));

        // exp date in token is expressed in seconds; while now() returns milliseconds
        const now = Math.ceil(Date.now() / 1000);

        if (tokenParts.exp < now) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          state.isLoggedIn = false;
          state.status = "failed";
          state.userId = null;
          console.log("Token expired ", tokenParts.exp, now);
        } else {
          state.isLoggedIn = true;
          state.userId = tokenParts.user_id;
          state.status = "succeeded";
        }
      } else {
        state.isLoggedIn = false;
        state.userId = null;
        state.status = "failed";
        console.log("Token not found");
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(userLoginAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(userLoginAsync.fulfilled, (state, action) => {
        localStorage.setItem("access_token", action.payload.access);
        localStorage.setItem("refresh_token", action.payload.refresh);
        axiosInstance.defaults.headers["Authorization"] =
          "Bearer " + localStorage.getItem("access_token");
        state.isLoggedIn = true;
        state.status = "succeeded";

        // Get user_id from access token
        const tokenParts = JSON.parse(
          atob(action.payload.access.split(".")[1])
        );

        state.userId = tokenParts.user_id;
      })
      .addCase(userLoginAsync.rejected, (state) => {
        state.status = "failed";
      });
  },
});

// Actions created by createSlice() automatically
export const { logout, updateLoginStatus } = authSlice.actions;

export default authSlice.reducer;
