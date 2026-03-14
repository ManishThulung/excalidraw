import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & {
      _skipAuthRedirect?: boolean;
    };

    // Only redirect on 401 if NOT a login/register endpoint
    if (error.response?.status === 401) {
      const url = config?.url || "";

      // Don't redirect on auth endpoints
      const isAuthEndpoint =
        url.includes("/login") || url.includes("/register");

      if (!isAuthEndpoint) {
        // localStorage.removeItem("isAuth");
        window.location.href = "/auth/signin";
      }
    }

    return Promise.reject(error);
  },
);

export async function getShapes(roomId: string) {
  const res = await api.get(`http://localhost:4000/api/shapes/${roomId}`);
  return res.data;
}
