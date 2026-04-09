import axios from "axios";
import { toast } from "react-toastify";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://law-backend-woad.vercel.app/api";

// ─── In-memory token store (never in localStorage) ──────────────────
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
};

// ─── Axios Instance ─────────────────────────────────────────────────
const api = axios.create({
  baseURL,
  withCredentials: true, // Always send cookies (refresh token is in httpOnly cookie)
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor ────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Add tenant code from subdomain
    if (typeof window !== "undefined") {
      const parts = window.location.hostname.split(".");
      if (parts.length > 1) {
        config.headers["x-tenant-code"] = parts[0];
      }
    }

    // Attach access token from memory (not localStorage, not cookies)
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Silent Refresh Logic ───────────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ─── Response Interceptor ───────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 403 — tenant/subscription blocking or permission error
    if (error.response && error.response.status === 403) {
      const data = error.response.data;
      const blockingCodes = [
        'TENANT_INACTIVE',
        'NO_SUBSCRIPTION',
        'SUBSCRIPTION_EXPIRED',
        'TRIAL_EXPIRED',
        'SUBSCRIPTION_PAST_DUE',
      ];

      if (data?.code && blockingCodes.includes(data.code)) {
        // Redirect to a dedicated blocked page — avoid redirect loops
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.startsWith("/account-suspended")
        ) {
          window.location.href = `/account-suspended?reason=${data.code}`;
        }
      } else {
        const language =
          typeof window !== "undefined"
            ? localStorage.getItem("language")
            : null;
        const message =
          language === "en"
            ? data?.messageEn ||
              "You do not have permission to perform this action"
            : data?.messageAr ||
              "ليس لديك صلاحية للقيام بهذا الإجراء";
        toast.error(message);
      }
    }

    // 401 — access token expired → try silent refresh
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Don't try to refresh if we're already on the refresh or login endpoint
      const isRefreshUrl = originalRequest.url?.includes("/auth/refresh");
      const isLoginUrl = originalRequest.url?.includes("/auth/login");
      if (isRefreshUrl || isLoginUrl) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Another refresh is in flight — queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint (refresh token sent automatically via httpOnly cookie)
        const { data } = await axios.post(
          `${baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (data.success && data.accessToken) {
          setAccessToken(data.accessToken);
          processQueue(null, data.accessToken);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } else {
          processQueue(new Error("Refresh failed"), null);
          handleForceLogout();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleForceLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ─── Force Logout (clear everything and redirect) ───────────────────
function handleForceLogout() {
  clearAccessToken();

  if (typeof window !== "undefined") {
    const isWebsiteRoute =
      window.location.pathname.startsWith("/website") &&
      !window.location.pathname.startsWith("/website/manage");

    if (!isWebsiteRoute && !window.location.pathname.includes("/login")) {
      window.location.href = "/login";
    }
  }
}

export default api;
