import { apiRequest } from "./api-client";

export interface WebsiteTheme {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  route: string;
}

// Static metadata for the themes this frontend actually has design routes for
// (/design1-4, /excellence). Selection is still confirmed against the backend
// via setStoreTheme() in stores.ts — this list is presentation-only until the
// backend's GET /api/v1/website-themes response shape is confirmed.
export const AVAILABLE_THEMES: WebsiteTheme[] = [
  {
    id: "design-1",
    name: "Design 1",
    description: "E-commerce style with product carousel",
    previewImage: "/assets/hero-design1.png",
    route: "/design1",
  },
  {
    id: "design-2",
    name: "Design 2",
    description: "Clean minimal business landing page",
    previewImage: "/assets/hero-design2.png",
    route: "/design2",
  },
  {
    id: "design-3",
    name: "Design 3",
    description: "Dark modern digital agency",
    previewImage: "/assets/hero-design3.png",
    route: "/design3",
  },
  {
    id: "design-4",
    name: "Design 4",
    description: "Light professional corporate site",
    previewImage: "/assets/hero-design4.png",
    route: "/design4",
  },
  {
    id: "design-5",
    name: "Design 5 — Excellence",
    description: "Premium e-commerce with blog & USP",
    previewImage: "/assets/hero-design5.png",
    route: "/excellence",
  },
];

export function listWebsiteThemes() {
  return apiRequest<WebsiteTheme[]>("/api/v1/website-themes");
}
