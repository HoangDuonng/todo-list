import axios, { AxiosError } from "axios";

export type ErrorResponse = {
  message: string;
  code: number;
  debug: string;
  status: string;
};

export function HandleError(
  err: Error | AxiosError<ErrorResponse>,
): ErrorResponse {
  if (axios.isAxiosError(err)) {
    return err.response?.data;
  } else {
    const error: ErrorResponse = {
      message: "Unknown Error",
      code: 500,
      debug: err.message,
      status: "error",
    };

    return error;
  }
}

const interceptor = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

interceptor.interceptors.request.use((config) => {
  // config.url = "https://devops-full-source-todo-example.com" ;
  config.headers.Authorization = `Bearer ${localStorage.getItem(
    "access_token",
  )}`;
  return config;
});

export default interceptor;
