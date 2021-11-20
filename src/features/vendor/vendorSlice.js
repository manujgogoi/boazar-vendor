import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createAPI, getUserVendor } from "../vendor/vendorAPI";

const initialState = {
  vendor: null,
  status: "idle",
};

export const updateUserVendorAsync = createAsyncThunk(
  "vendor/getUserVendor",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await getUserVendor(userId);
      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);

export const vendorRegisterAsync = createAsyncThunk(
  "vendor/register",
  async (name, { rejectWithValue }) => {
    // thunkAPI.rejectWithValue is used to provide custom payload in rejected action
    try {
      const response = await createAPI(name);
      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);

const vendorSlice = createSlice({
  name: "vendor",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(vendorRegisterAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(vendorRegisterAsync.fulfilled, (state, action) => {
        state.vendor = action.payload;
        state.status = "succeeded";
      })
      .addCase(vendorRegisterAsync.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(updateUserVendorAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserVendorAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.vendor = action.payload;
      })
      .addCase(updateUserVendorAsync.rejected, (state, error) => {
        state.status = "failed";
        state.vendor = null;
      });
  },
});

// State selector functions
export const selectVendorProductById = (state, id) => {
  state.vendor.products.find((product) => product.id === id);
};

export default vendorSlice.reducer;
