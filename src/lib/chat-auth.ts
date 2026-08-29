import { apiRequest } from "./api-client";
import type { StoredSession } from "./session";

export type ChatAuthRole = "owner" | "customer" | "staff";

export interface ChatAuthRegisterPayload {
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: ChatAuthRole;
  storeId?: string;
}

export interface ChatAuthLoginPayload {
  email: string;
  password: string;
}

export type ChatAuthSession = StoredSession;

export function registerChatAuth(payload: ChatAuthRegisterPayload) {
  return apiRequest<ChatAuthSession>("/api/v1/chat-auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginChatAuth(payload: ChatAuthLoginPayload) {
  return apiRequest<ChatAuthSession>("/api/v1/chat-auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
