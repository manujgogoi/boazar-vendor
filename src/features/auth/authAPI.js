import axiosInstance from "../../services/Axios";
import { TOKEN_URL } from "../../utils/urls";

export const loginAPI = (email, password) => {
  return axiosInstance.post(TOKEN_URL, {
    email,
    password,
  });
};
