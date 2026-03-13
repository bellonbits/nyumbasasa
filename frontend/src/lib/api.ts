import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import type { SearchFilters, Property, PaginatedResponse, ApiResponse, AuthTokens, User, AgentStats } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach JWT ────────────────────────────────────────────
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = Cookies.get("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor: handle 401 ──────────────────────────────────────────
apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      if (typeof window !== "undefined") window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<ApiResponse<{ tokens: AuthTokens; user: User }>>("/auth/login", { email, password }),

  register: (payload: { name: string; email: string; phone: string; password: string; agencyName?: string }) =>
    apiClient.post<ApiResponse<{ tokens: AuthTokens; user: User }>>("/auth/register", payload),

  me: () => apiClient.get<ApiResponse<User>>("/auth/me"),

  updateProfile: (dto: { name?: string; phone?: string; agencyName?: string }) =>
    apiClient.patch<ApiResponse<User>>("/auth/profile", dto),

  changePassword: (dto: { currentPassword: string; newPassword: string }) =>
    apiClient.patch<ApiResponse<{ changed: boolean }>>("/auth/password", dto),

  logout: () => apiClient.post("/auth/logout"),
};

// ─── Properties ───────────────────────────────────────────────────────────────

export const propertiesApi = {
  search: (filters: SearchFilters) =>
    apiClient.get<PaginatedResponse<Property>>("/properties", { params: filters }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Property>>(`/properties/${id}`),

  getFeatured: () =>
    apiClient.get<ApiResponse<Property[]>>("/properties/featured"),

  create: (data: FormData) =>
    apiClient.post<ApiResponse<Property>>("/properties", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  update: (id: string, data: FormData) =>
    apiClient.patch<ApiResponse<Property>>(`/properties/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  delete: (id: string) =>
    apiClient.delete(`/properties/${id}`),

  report: (id: string, reason: string) =>
    apiClient.post(`/properties/${id}/report`, { reason }),

  incrementView: (id: string) =>
    apiClient.post(`/properties/${id}/view`),
};

// ─── Agent Dashboard ──────────────────────────────────────────────────────────

export const dashboardApi = {
  getStats: () =>
    apiClient.get<ApiResponse<AgentStats>>("/dashboard/stats"),

  getMyListings: (page = 1, limit = 10) =>
    apiClient.get<PaginatedResponse<Property>>("/dashboard/listings", { params: { page, limit } }),
};

// ─── Locations ────────────────────────────────────────────────────────────────

export const locationApi = {
  getCounties: () =>
    apiClient.get<ApiResponse<{ id: string; name: string; slug: string; listingCount: number }[]>>("/locations/counties"),

  getTowns: (countyId: string) =>
    apiClient.get<ApiResponse<{ id: string; name: string }[]>>(`/locations/counties/${countyId}/towns`),

  getEstates: (townId: string) =>
    apiClient.get<ApiResponse<{ id: string; name: string }[]>>(`/locations/towns/${townId}/estates`),
};
