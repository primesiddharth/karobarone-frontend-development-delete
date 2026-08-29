import { apiRequest } from "./api-client";

export type SectionType = "hero" | "about" | "products" | "usp" | "testimonials" | "contact" | "custom";

export interface Section {
  id: string;
  storeId: string;
  type: SectionType;
  title: string;
  order: number;
  visible: boolean;
  config?: Record<string, unknown>;
}

export interface CreateSectionPayload {
  type: SectionType;
  title: string;
  order: number;
  visible?: boolean;
  config?: Record<string, unknown>;
}

export type UpdateSectionPayload = Partial<CreateSectionPayload>;

export function listSections(storeId: string) {
  return apiRequest<Section[]>(`/api/v1/sections?storeId=${storeId}`);
}

export function createSection(storeId: string, payload: CreateSectionPayload) {
  return apiRequest<Section>("/api/v1/sections", {
    method: "POST",
    body: JSON.stringify({ storeId, ...payload }),
  });
}

export function updateSection(sectionId: string, payload: UpdateSectionPayload) {
  return apiRequest<Section>(`/api/v1/sections/${sectionId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteSection(sectionId: string) {
  return apiRequest<void>(`/api/v1/sections/${sectionId}`, { method: "DELETE" });
}
