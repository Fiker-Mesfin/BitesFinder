// src/api/auth.js
import axios from "axios";

const API = import.meta.env.VITE_API_URL; // e.g., http://localhost:5000/api

export const sendOtp = (email, displayName) => {
  return axios.post(`${API}/auth/send-otp`, { email, displayName });
};

export const verifyOtp = (email, code, password, displayName) => {
  return axios.post(`${API}/auth/verify-otp`, {
    email,
    code,
    password,
    displayName,
  });
};

export const loginUser = (email, password) => {
  return axios.post(`${API}/auth/login`, { email, password });
};
// Forgot password
export const forgotPassword = (email) =>
  axios.post(`${API}/auth/forgot-password`, { email });

export const sendResetOtp = async (email) => {
  return axios.post(`${API}/auth/forgot-password`, { email });
};
// Reset password
export const resetPassword = (email, code, newPassword) =>
  axios.post(`${API}/auth/reset-password`, {
    email,
    code,
    newPassword,
  });
// api/auth.js
export const verifyResetOtp = async (email, otp) => {
  const res = await axios.post("/auth/verify-reset-otp", { email, otp });
  return res;
};
