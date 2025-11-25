import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: false,
});

// Attach Access Token
api.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto Refresh Token
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refToken = Cookies.get("refreshToken");
        const refreshRes = await api.post("/auth/refresh", {
          refresh_token: refToken,
        });
        Cookies.set("accessToken", refreshRes.data.access_token);
        Cookies.set("refreshToken", refreshRes.data.refresh_token);
        return api(original);
      } catch (err) {
        Cookies.remove(`Final Error: ${err}`);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
