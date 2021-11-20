import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/Axios";

const initialState = {
  data: null,
  status: "idle",
};

const productsSlice = createSlice({
  name: "products",
  initialState,

  reducers: {},

  extraReducers: (builder) => {},
});

export default productsSlice.reducer;
