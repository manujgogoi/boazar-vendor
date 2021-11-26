import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getVendorProductsAPI } from "./productsAPI";

const initialState = {
  data: null,
  status: "idle",
};

export const getVendorProductsAsync = createAsyncThunk(
  "products/vendor",
  async (vendorId, { rejectWithValue }) => {
    try {
      const response = await getVendorProductsAPI(vendorId);
      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getVendorProductsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getVendorProductsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        console.log(action.payload);
      })
      .addCase(getVendorProductsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.data = null;
      });
  },
});

export default productsSlice.reducer;
