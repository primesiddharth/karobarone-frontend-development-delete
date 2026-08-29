import { apiRequest } from "./api-client";

export interface WebsiteSettings {
  storeId: string;
  siteTitle: string;
  metaDescription?: string;
  primaryColor?: string;
  timezone?: string;
  currency?: string;
}

export type UpdateWebsiteSettingsPayload = Partial<Omit<WebsiteSettings, "storeId">>;

export function getWebsiteSettings(storeId: string) {
  return apiRequest<WebsiteSettings>(`/api/v1/website-settings/${storeId}`);
}

export function updateWebsiteSettings(storeId: string, payload: UpdateWebsiteSettingsPayload) {
  return apiRequest<WebsiteSettings>(`/api/v1/website-settings/${storeId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
