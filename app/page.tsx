"use client";

import { loginUser } from "@/lib/api/auth";
import { AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await loginUser(email, password);
      router.push("/dashboard");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;

      setErrorMsg(
        axiosError.response?.data?.message ||
          "Invalid credentials, email or password is wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f7fb] relative overflow-hidden flex items-center justify-center">
      {/* Background Gradient Circles */}
      <div className="absolute bottom-[-300px] left-1/2 -translate-x-1/2 w-[1300px] h-[1300px] bg-linear-to-b from-blue-300/40 to-blue-500/80 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-200px] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-linear-to-b from-blue-300/40 to-blue-500/80 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-linear-to-b from-blue-300/40 to-blue-500/80 rounded-full blur-3xl opacity-40"></div>

      {/* Login Card */}
      <form
        onSubmit={handleSubmit}
        className="relative w-[420px] bg-white/40 backdrop-blur-xl shadow-xl rounded-xl px-8 py-10 border border-white/30"
      >
        {/* Logo */}
        <div className="flex justify-center mb-5">
          <Image
            src="/forex-logo.png"
            alt="logo"
            width={56}
            height={56}
            className="w-40 h-14"
          />
        </div>

        <h1 className="text-2xl font-semibold text-center text-gray-800">
          2MPro Log in
        </h1>

        {/* <p className="text-center text-gray-600 text-sm mt-1">
          Do you have an account?
          <a href="/register" className="text-blue-600 ml-1">
            Register
          </a>
        </p> */}

        {/* EMAIL */}
        <div className="mt-6">
          <label className="text-gray-700 text-sm">Email</label>
          <input
            type="email"
            placeholder="Enter Your Email"
            className="w-full mt-1 p-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white/70"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div className="mt-4">
          <label className="text-gray-700 text-sm">Password</label>
          <input
            type="password"
            placeholder="Enter Your Password"
            className="w-full mt-1 p-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white/70"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Error Message */}
        {errorMsg && <p className="text-red-500 text-xs mt-2">{errorMsg}</p>}

        {/* OPTIONS */}
        {/* <div className="flex justify-between items-center mt-5">
          <label className="flex items-center gap-2 text-gray-700 text-sm">
            <input type="checkbox" className="accent-blue-600" />
            Stay Logged in
          </label>
          <a href="/forgot-password" className="text-blue-600 text-sm">
            Forget Password?
          </a>
        </div> */}

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 py-3 rounded-md text-lg font-semibold text-white
    ${
      loading
        ? "bg-blue-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700"
    }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Signing in...
            </span>
          ) : (
            "Sign in"
          )}
        </button>
      </form>
    </div>
  );
}
