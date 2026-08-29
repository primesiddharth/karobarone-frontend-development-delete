const SESSION_STORAGE_KEY = "karobarone_session";

// Fixed by backend: accessToken, tokenType, userId, role, storeId only — no refreshToken.
export interface StoredSession {
  accessToken: string;
  tokenType: string;
  userId: string;
  role: string;
  storeId: string | null;
}

export function getStoredSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

export function setStoredSession(session: StoredSession) {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}
