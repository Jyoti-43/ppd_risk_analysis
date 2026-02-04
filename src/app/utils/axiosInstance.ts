import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { setCredientials, logout } from "../redux/feature/user/userSlice";

// Lazy store access to avoid circular dependency
let store: any;
export const injectStore = (_store: any) => {
  store = _store;
};

const baseURL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance
export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  // Default to false to avoid CORS issues on public or standard endpoints
  // We'll enable it manually for the refresh token call
  withCredentials: false,
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // We will handle token injection in the baseQuery or via a separate setup
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh token endpoint using httpOnly cookie (backend reads cookie)
        const response = await axios.post(
          `${baseURL}/refresh-token`,
          {},
          { withCredentials: true },
        );

        const { access_token, refresh_token: newRefreshToken } =
          response.data || {};

        // Update tokens in Redux store if store is injected
        if (store) {
          const currentUser = store.getState().user.currentUser;
          store.dispatch(
            setCredientials({
              userId: currentUser.userId!,
              userName: currentUser.userName || undefined,
              email: currentUser.email!,
              access_token,
              refreshToken: newRefreshToken || currentUser.refreshToken || null,
              role: currentUser.role!,
            }),
          );
        }

        processQueue(null, access_token);
        isRefreshing = false;

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        if (store) {
          store.dispatch(logout());
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
