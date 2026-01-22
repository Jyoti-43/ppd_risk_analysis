import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { store } from "../redux/store";
import { setCredientials, logout } from "../redux/feature/user/userSlice";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance
export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  // Send cookies (httpOnly refresh token) with requests when needed
  withCredentials: true,
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

// Request interceptor to add access token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const token = state.user.currentUser.access_token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

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
        // Debug: log refresh attempt
        try {
          const state = store.getState();
          const refreshToken = state.user.currentUser.refreshToken;
          console.debug("[axiosInstance] attempting refresh-token", {
            refreshToken: refreshToken ? "(present)" : "(missing)",
            baseURL,
            trigger:
              originalRequest?.url || originalRequest?.baseURL || "unknown",
          });
        } catch (e) {
          /* ignore logging errors */
        }

        // Call refresh token endpoint using httpOnly cookie (backend reads cookie)
        const response = await axios.post(
          `${baseURL}/refresh-token`,
          {},
          { withCredentials: true },
        );

        // Debug: log refresh response
        try {
          console.debug(
            "[axiosInstance] refresh-token response",
            response?.data,
          );
        } catch (e) {
          /* ignore logging errors */
        }

        const { access_token, refresh_token: newRefreshToken } =
          response.data || {};

        // Update tokens in Redux store (keep any existing refreshToken value; when using httpOnly cookie
        // the client won't receive the refresh token in JS. Backend should set the cookie.)
        const currentUser = store.getState().user.currentUser;
        store.dispatch(
          setCredientials({
            userId: currentUser.userId!,
            userName: currentUser.userName || undefined,
            email: currentUser.email!,
            access_token,
            // If backend returns a refresh token in response (not recommended with httpOnly cookie), use it;
            // otherwise preserve the existing stored value (may be null).
            refreshToken: newRefreshToken || currentUser.refreshToken || null,
            role: currentUser.role!,
          }),
        );

        // Update the original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }

        processQueue(null, access_token);
        isRefreshing = false;

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError, null);
        isRefreshing = false;
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
