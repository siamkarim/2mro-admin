import api from "../apiClient";
import { apiLink } from "../apiLink";
import Cookies from "js-cookie";

export const fetchAppUsers = async (
  skip: number,
  limit: number,
  accountType: string
) => {
  const { data } = await api.get(
    `${apiLink.USERS_VERIFICATION}?skip=${skip}&limit=${limit}&account_type=${accountType}`
  );
  return data;
};

export const fetchOnlineUsers = async (limit: number) => {
  const { data } = await api.get(apiLink.ATIVE_USER + `?limit=${limit}`);
  return data;
};

export const userLogout = async (): Promise<boolean> => {
  try {
    const { data } = await api.post(apiLink.USER_LOGOUT);

    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    return data;
  } catch (error) {
    console.error("Logout failed:", error);
    return false;
  }
};
