import axiosInstance from "../../services/Axios";
import { BASE_URL } from "../../utils/urls";

export const getVendorProductsAPI = (vendorId) => {
  return axiosInstance.get(BASE_URL + `vendor/${vendorId}/products/`);
};
