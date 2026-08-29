import { apiRequest } from "./api-client";

export type DomainStatus = "pending" | "verified" | "failed";

export interface DnsRecord {
  type: string;
  name: string;
  value: string;
}

export interface Domain {
  id: string;
  storeId: string;
  domainName: string;
  status: DomainStatus;
  dnsRecords: DnsRecord[];
  createdAt: string;
}

export function listDomains(storeId: string) {
  return apiRequest<Domain[]>(`/api/v1/domains?storeId=${storeId}`);
}

export function addDomain(storeId: string, domainName: string) {
  return apiRequest<Domain>("/api/v1/domains", {
    method: "POST",
    body: JSON.stringify({ storeId, domainName }),
  });
}

export function deleteDomain(domainId: string) {
  return apiRequest<void>(`/api/v1/domains/${domainId}`, { method: "DELETE" });
}

export function triggerDomainVerification(domainId: string) {
  return apiRequest<Domain>(`/api/v1/domains/${domainId}/verify`, { method: "POST" });
}

export function getDomainVerificationStatus(domainId: string) {
  return apiRequest<Domain>(`/api/v1/domains/${domainId}/verify`);
}
