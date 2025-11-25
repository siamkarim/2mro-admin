import api from "../apiClient";
import { apiLink } from "../apiLink";

export const fetchPendingDeposit = async (transactionType: string) => {
  const { data } = await api.get(
    `${apiLink.PENDING_TRANSACTION}?transaction_type=${transactionType}`
  );
  return data;
};
