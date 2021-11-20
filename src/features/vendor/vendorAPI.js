import axiosInstance from "../../services/Axios";
import { BASE_URL } from "../../utils/urls";

const vendorUrl = BASE_URL + "vendor/";

export const createAPI = (name) => {
  return axiosInstance.post(vendorUrl, {
    name,
  });
};

export const getUserVendor = (userId) => {
  return axiosInstance.get(`${BASE_URL}users/${userId}/get_own_vendor`);
};
