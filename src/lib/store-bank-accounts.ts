import { apiRequest } from "./api-client";

export interface BankAccount {
  id: string;
  storeId: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName?: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface CreateBankAccountPayload {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName?: string;
}

export function listBankAccounts(storeId: string) {
  return apiRequest<BankAccount[]>(`/api/v1/store-bank-accounts?storeId=${storeId}`);
}

export function createBankAccount(storeId: string, payload: CreateBankAccountPayload) {
  return apiRequest<BankAccount>("/api/v1/store-bank-accounts", {
    method: "POST",
    body: JSON.stringify({ storeId, ...payload }),
  });
}

export function deleteBankAccount(accountId: string) {
  return apiRequest<void>(`/api/v1/store-bank-accounts/${accountId}`, { method: "DELETE" });
}

export function setPrimaryBankAccount(accountId: string) {
  return apiRequest<BankAccount>(`/api/v1/store-bank-accounts/${accountId}/primary`, {
    method: "PUT",
  });
}
