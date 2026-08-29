import { apiRequest, apiRequestForm } from "./api-client";

export type WebsiteMediaType = "logo" | "banner";

export interface WebsiteMedia {
  id: string;
  storeId: string;
  type: WebsiteMediaType;
  url: string;
  createdAt: string;
}

export function listWebsiteMedia(storeId: string) {
  return apiRequest<WebsiteMedia[]>(`/api/v1/website-media?storeId=${storeId}`);
}

export function uploadWebsiteMedia(storeId: string, type: WebsiteMediaType, file: File) {
  const formData = new FormData();
  formData.append("storeId", storeId);
  formData.append("type", type);
  formData.append("file", file);
  return apiRequestForm<WebsiteMedia>("/api/v1/website-media", formData);
}

export function deleteWebsiteMedia(mediaId: string) {
  return apiRequest<void>(`/api/v1/website-media/${mediaId}`, { method: "DELETE" });
}
