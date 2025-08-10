/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * axiosBaseQuery with cookie-based token storage (no localStorage).
 *
 * What this does:
 *  - Reads accessToken, refreshToken, role from cookies before each request.
 *  - Adds Authorization header with accessToken (if present).
 *  - On 401, attempts a single refresh using refreshToken cookie.
 *  - If refresh succeeds, updates accessToken cookie and retries the original request.
 *  - If refresh fails, clears auth cookies and dispatches logout.
 *
 * Assumptions:
 *  - Backend still returns { accessToken, refreshToken, role, ... } in /auth/login & /auth/refresh-token responses.
 *  - Cookies are allowed (same-site or cross-site configuration as needed).
 *  - You have updated your authSlice to STOP using localStorage (remove loadFromStorage/setCredentials persistence code).
 *
 * Recommended BACKEND improvement (safer):
 *  - Send refreshToken as HttpOnly Secure SameSite=Strict cookie from backend instead of JSON body.
 *  - Keep accessToken in memory or short-lived cookie (non-HttpOnly only if you must).
 * For now we set both in JS-managed cookies as per your request.
 */

import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { logout, setCredentials } from "../fetures/authSlice";
// import type { RootState } from "../store";

interface AxiosBaseQueryArgs {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: any;
  params?: any;
  headers?: Record<string, string>;
}

const ACCESS_COOKIE = "accessToken";
const REFRESH_COOKIE = "refreshToken";
const ROLE_COOKIE = "role";

const ACCESS_TTL_MIN = 120; // 2 hours
const REFRESH_TTL_DAYS = 7; // 7 days

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false, // Set true if backend sets HttpOnly cookies itself
});

// Helper: set cookies
function setAuthCookies(payload: {
  accessToken?: string;
  refreshToken?: string;
  role?: string;
  supervisorApproved?: boolean;
  isApproved?: boolean;
}) {
  if (payload.accessToken) {
    Cookies.set(ACCESS_COOKIE, payload.accessToken, {
      // session cookie if you prefer: omit expires
      expires: ACCESS_TTL_MIN / (60 * 24), // fraction of a day
      sameSite: "Strict",
      secure: true,
    });
  }
  if (payload.refreshToken) {
    Cookies.set(REFRESH_COOKIE, payload.refreshToken, {
      expires: REFRESH_TTL_DAYS,
      sameSite: "Strict",
      secure: true,
    });
  }
  if (payload.role) {
    Cookies.set(ROLE_COOKIE, payload.role, {
      expires: REFRESH_TTL_DAYS,
      sameSite: "Strict",
      secure: true,
    });
  }
}

// Helper: clear cookies
function clearAuthCookies() {
  Cookies.remove(ACCESS_COOKIE);
  Cookies.remove(REFRESH_COOKIE);
  Cookies.remove(ROLE_COOKIE);
}

// Shared refresh lock
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function performRefresh(
  refreshToken: string | undefined
): Promise<string | null> {
  if (!refreshToken) return null;
  try {
    const res = await axiosInstance.post("/auth/refresh-token", {
      refreshToken,
    });
    const { accessToken, refreshToken: newRefreshToken, role } = res.data || {};

    if (accessToken) {
      setAuthCookies({
        accessToken,
        refreshToken: newRefreshToken ?? refreshToken,
        role,
      });
    }
    return accessToken ?? null;
  } catch {
    return null;
  }
}

export const axiosBaseQuery =
  (): BaseQueryFn<
    AxiosBaseQueryArgs,
    unknown,
    { status?: number; data?: any }
  > =>
  async (args, api) => {
    // const state = api.getState() as RootState; // Removed unused variable

    // Always read the freshest cookies
    const accessToken = Cookies.get(ACCESS_COOKIE);
    const refreshToken = Cookies.get(REFRESH_COOKIE);

    const config: AxiosRequestConfig = {
      url: args.url,
      method: args.method || "GET",
      data: args.data,
      params: args.params,
      headers: {
        ...(args.headers || {}),
      },
    };

    if (accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }

    try {
      const result = await axiosInstance.request(config);

      // If this is a login or manual refresh response, capture tokens
      if (
        ["/auth/login", "/auth/refresh-token"].some((endpoint) =>
          config.url?.endsWith(endpoint)
        )
      ) {
        const {
          accessToken: accessToken,
          refreshToken: refreshToken,
          role,
          supervisorApproved,
          isApproved,
        } = (result.data as any) || {};
        if (accessToken || refreshToken || role) {
          setAuthCookies({
            accessToken: accessToken,
            refreshToken: refreshToken,
            role,
            supervisorApproved,
            isApproved,
          });
          // Keep Redux state in sync
          api.dispatch(
            setCredentials({
              accessToken: accessToken,
              refreshToken: refreshToken,
              role,
              supervisorApproved,
              isApproved,
            })
          );
        }
      }

      return { data: result.data };
    } catch (err) {
      const error = err as AxiosError;

      // Attempt refresh on 401 only once
      if (error.response?.status === 401 && refreshToken) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = performRefresh(refreshToken).finally(() => {
            isRefreshing = false;
          });
        }
        const newAccess = await refreshPromise;

        if (newAccess) {
          // Update Redux store with new access token (refresh token may also rotate)
          api.dispatch(
            setCredentials({
              accessToken: newAccess,
              refreshToken: Cookies.get(REFRESH_COOKIE) || refreshToken,
              role: Cookies.get(ROLE_COOKIE) as any,
            })
          );

          // Retry original request with new access token
          try {
            const retry = await axiosInstance.request({
              ...config,
              headers: {
                ...(config.headers || {}),
                Authorization: `Bearer ${newAccess}`,
              },
            });
            return { data: retry.data };
          } catch (retryErr) {
            return {
              error: {
                status: (retryErr as AxiosError).response?.status,
                data: (retryErr as AxiosError).response?.data,
              },
            };
          }
        } else {
          // Refresh failed
          clearAuthCookies();
          api.dispatch(logout());
        }
      }

      // If explicitly logging out, purge cookies
      if (config.url?.endsWith("/auth/logout")) {
        clearAuthCookies();
        api.dispatch(logout());
      }

      return {
        error: {
          status: error.response?.status,
          data: error.response?.data || error.message,
        },
      };
    }
  };
