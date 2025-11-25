import api from "../apiClient";
import { apiLink } from "../apiLink";

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
