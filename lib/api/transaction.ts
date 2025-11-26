



import api from "../apiClient";
import { apiLink } from "../apiLink";

export const getUserTransaction = async (
  userId: number,
  transactionType: string
) => {
  const { data } = await api.get(
    `${apiLink.USERS}/${userId}/transactions?type=${transactionType}`
  );
  return data;
};