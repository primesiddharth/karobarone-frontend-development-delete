import { apiRequest } from "./api-client";

export type BusinessNature = "product" | "service";
export type BusinessType = "gst" | "pan";
export type StoreStatus = "draft" | "published";

export interface Store {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  contactPerson: string;
  designation?: string;
  email: string;
  phoneNumber: string;
  brandTagline?: string;
  businessNature: BusinessNature;
  businessType: BusinessType;
  gstNumber?: string;
  panNumber?: string;
  themeId?: string;
  status: StoreStatus;
  previewUrl?: string;
  publishedUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStorePayload {
  name: string;
  contactPerson: string;
  designation?: string;
  email: string;
  phoneNumber: string;
  brandTagline?: string;
  businessNature: BusinessNature;
  businessType: BusinessType;
  gstNumber?: string;
  panNumber?: string;
}

export type UpdateStorePayload = Partial<CreateStorePayload>;

export function createStore(payload: CreateStorePayload) {
  return apiRequest<Store>("/api/v1/stores", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getStore(storeId: string) {
  return apiRequest<Store>(`/api/v1/stores/${storeId}`);
}

export function updateStore(storeId: string, payload: UpdateStorePayload) {
  return apiRequest<Store>(`/api/v1/stores/${storeId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function publishStore(storeId: string) {
  return apiRequest<Store>(`/api/v1/stores/${storeId}/publish`, { method: "POST" });
}

export function unpublishStore(storeId: string) {
  return apiRequest<Store>(`/api/v1/stores/${storeId}/unpublish`, { method: "POST" });
}

export function setStoreTheme(storeId: string, themeId: string) {
  return apiRequest<Store>(`/api/v1/stores/${storeId}/theme`, {
    method: "PUT",
    body: JSON.stringify({ themeId }),
  });
}
