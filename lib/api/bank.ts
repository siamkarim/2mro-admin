import api from "../apiClient";
import { apiLink } from "../apiLink";

export const getGlobalBank = async () => {
  const { data } = await api.get(`${apiLink.PAYMENT}/bank`);
  return data;
};

export const updateGlobalBank = async (payload: {
  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
  bank_iban: string;
  bank_swift_code: string;
  bank_deposit_fee: number;
  bank_withdrawal_fee: number;
}) => {
  const { data } = await api.put(`${apiLink.PAYMENT}/bank`, payload);
  return data;
};

export const getGlobalCrypto = async () => {
  const { data } = await api.get(apiLink.DEPOSIT + "/crypto-wallets");
  return data;
};

export const addGlobalCrypto = async (payload: {
  currency: string;
  wallet_address: string;
  network: string;
}) => {
  const { data } = await api.put(apiLink.CYPTO_DEPOSIT, payload);
  return data;
};

export const updateGlobalCrypto = async (
  id: number,
  payload: {
    symbol: string;
    address: string;
    network: string;
  }
) => {
  const { data } = await api.put(apiLink.CYPTO_DEPOSIT + `/${id}`, payload);
  return data;
};

export const deleteGlobalCrypto = async (id: number) => {
  const { data } = await api.delete(apiLink.CYPTO_DEPOSIT + `/${id}`);
  return data;
};
