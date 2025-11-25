import Cookies from "js-cookie";
import api from "../apiClient";

export async function loginUser(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });

  console.log(res.data);
  Cookies.set("accessToken", res.data.access_token, { expires: 1 });
  Cookies.set("refreshToken", res.data.refresh_token, { expires: 7 });

  return res.data;
}
