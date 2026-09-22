const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}, token?: string | null): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.detail) detail = typeof body.detail === "string" ? body.detail : detail;
    } catch {
      // ignore JSON parse failure
    }
    throw new ApiError(detail, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export interface GuidanceRequestPayload {
  full_name: string;
  mobile_number: string;
  male_deity: string;
  female_deity: string;
  turnstile_token: string;
}

export const api = {
  submitRequest: (payload: GuidanceRequestPayload) =>
    request<{ reference_number: string }>("/api/requests", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (email: string, password: string) =>
    request<{ access_token: string; admin_name: string; token_type: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  dashboard: (token: string) => request<Record<string, number>>("/api/admin/dashboard", {}, token),

  listRequests: (token: string, status?: string) =>
    request<any[]>(`/api/admin/requests${status ? `?status_filter=${status}` : ""}`, {}, token),

  getRequest: (token: string, id: number) => request<any>(`/api/admin/requests/${id}`, {}, token),

  updateStatus: (token: string, id: number, status: string) =>
    request<any>(
      `/api/admin/requests/${id}/status`,
      { method: "PATCH", body: JSON.stringify({ status }) },
      token
    ),

  getActivity: (token: string, id: number) => request<any[]>(`/api/admin/requests/${id}/activity`, {}, token),
};
