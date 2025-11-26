import api from "../apiClient";
import { apiLink } from "../apiLink";

export const getTraderPosition = async (
  user_id: number,
  status: string,
  accountId: number | null
) => {
  const { data } = await api.get(
    `${apiLink.USERS}/${user_id}/positions?account_id=${accountId}&status=${status}`
  );
  return data;
};
