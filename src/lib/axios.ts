import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';

const getApiUrl = (): string => {
  let url = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
  
  if (url) {
    url = url.trim();
    // Ensure absolute protocol prefix for external hosts to prevent relative browser resolution
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.includes('.') || !url.startsWith('/')) {
        url = `https://${url}`;
      }
    }
    // Ensure /api/v1 suffix is present
    if (!url.includes('/api/v1') && (url.startsWith('http://') || url.startsWith('https://'))) {
      url = url.replace(/\/+$/, '') + '/api/v1';
    }
  }
  return url;
};

const API_URL = getApiUrl();

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject JWT Bearer Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Silent Refresh on 401 Errors
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Avoid infinite loops and handle actual 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/verify-otp')) {
        // If login or refresh calls fail with 401, clear session immediately
        useAuthStore.getState().clearSession();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = useAuthStore.getState().refreshToken;

      if (!refreshToken) {
        useAuthStore.getState().clearSession();
        return Promise.reject(error);
      }

      try {
        // Execute refresh token exchange
        const res = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token: newRefreshToken } = res.data.data;
        const currentUser = useAuthStore.getState().user;

        // Update stores
        if (currentUser) {
          useAuthStore.getState().setSession(access_token, newRefreshToken, currentUser);
        } else {
          useAuthStore.getState().updateAccessToken(access_token);
          if (typeof window !== 'undefined') {
            localStorage.setItem('econ_refresh_token', newRefreshToken);
          }
          useAuthStore.setState({ refreshToken: newRefreshToken });
        }

        processQueue(null, access_token);
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().clearSession();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
