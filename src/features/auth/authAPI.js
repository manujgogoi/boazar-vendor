import axiosInstance from "../../services/Axios";
import { TOKEN_URL } from "../../utils/urls";

export const loginAPI = async (email, password) => {
  try {
    const response = await axiosInstance.post(TOKEN_URL, {
      email,
      password,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
