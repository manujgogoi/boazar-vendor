import axios from "axios";
import { BASE_URL, REFRESH_TOKEN_URL } from "../utils/urls";

let axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    Authorization: localStorage.getItem("access_token")
      ? "Bearer " + localStorage.getItem("access_token")
      : null,
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token")
      ? localStorage.getItem("access_token")
      : null;
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    // config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (typeof error.response === "undefined") {
      console.log(
        "A Server/Network error occured. Looks like CORS might be the problem."
      );
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      originalRequest.url === REFRESH_TOKEN_URL
    ) {
      window.location.href = "/login/";
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]));

        // exp date in token is expressed in seconds; while now() returns milliseconds
        const now = Math.ceil(Date.now() / 1000);

        if (tokenParts.exp > now) {
          return axiosInstance
            .post(REFRESH_TOKEN_URL, {
              refresh: refreshToken,
            })
            .then((response) => {
              localStorage.setItem("access_token", response.data.access);
              // localStorage.setItem("refresh_token", response.data.refresh);

              axiosInstance.defaults.headers["Authorization"] =
                "Bearer " + response.data.access;
              originalRequest.headers["Authorization"] =
                "Bearer " + response.data.access;

              return axiosInstance(originalRequest);
            })
            .catch((error) => {
              // console.log("Get New Access Token Error: ", error);
              return axiosInstance(originalRequest);
            });
        } else {
          console.log("Refresh token is expired ", tokenParts.exp, now);
          // window.location.href = "/login/";
        }
      } else {
        console.log("Refresh token not available.");
        // window.location.href = "/login/";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
