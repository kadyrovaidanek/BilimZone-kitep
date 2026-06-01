import axios from "axios";

const API = axios.create({
  baseURL: "https://bilimzone-backend1.onrender.com/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token && token !== "undefined" && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const registerUser = (data: FormData) => {
  return API.post("/register/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const loginUser = (data: {
  identifier: string;
  password: string;
}) => {
  return API.post("/login/", data);
};

export const checkUsername = (username: string) => {
  return API.get(`/check-username/?username=${encodeURIComponent(username)}`);
};

export const checkEmail = (email: string) => {
  return API.get(`/check-email/?email=${encodeURIComponent(email)}`);
};

export const getProfile = (userId: number) => {
  return API.get(`/profile/?user_id=${userId}`);
};

export const updateProfile = (userId: number, data: FormData) => {
  return API.put(`/profile/?user_id=${userId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};