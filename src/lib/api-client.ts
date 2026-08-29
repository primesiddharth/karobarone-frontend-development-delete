import { getStoredSession } from "./session";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const session = getStoredSession();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(session ? { Authorization: `${session.tokenType || "Bearer"} ${session.accessToken}` } : {}),
      ...options.headers,
    },
  });

  const text = await res.text();
  const body = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = body?.message || body?.error || res.statusText || "Request failed";
    throw new ApiError(message, res.status);
  }

  return body as T;
}

export async function apiRequestForm<T>(
  path: string,
  formData: FormData,
  options: RequestInit = {}
): Promise<T> {
  const session = getStoredSession();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    method: options.method ?? "POST",
    body: formData,
    headers: {
      ...(session ? { Authorization: `${session.tokenType || "Bearer"} ${session.accessToken}` } : {}),
      ...options.headers,
    },
  });

  const text = await res.text();
  const body = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = body?.message || body?.error || res.statusText || "Request failed";
    throw new ApiError(message, res.status);
  }

  return body as T;
}
