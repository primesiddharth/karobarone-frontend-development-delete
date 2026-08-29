"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { NoStoreNotice } from "@/components/dashboard/NoStoreNotice";
import { ApiError } from "@/lib/api-client";
import {
  BankAccount,
  CreateBankAccountPayload,
  listBankAccounts,
  createBankAccount,
  deleteBankAccount,
  setPrimaryBankAccount,
} from "@/lib/store-bank-accounts";
import { Landmark, Loader2, Star, Trash2 } from "lucide-react";

const emptyForm: CreateBankAccountPayload = {
  accountHolderName: "",
  accountNumber: "",
  ifscCode: "",
  bankName: "",
  branchName: "",
};

export default function BankAccountsPage() {
  const { session } = useAuth();

  if (!session?.storeId) return <NoStoreNotice />;

  return <BankAccountsContent storeId={session.storeId} />;
}

function BankAccountsContent({ storeId }: { storeId: string }) {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [form, setForm] = useState<CreateBankAccountPayload>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setLoadError("");
    try {
      setAccounts(await listBankAccounts(storeId));
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : "Could not load bank accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const created = await createBankAccount(storeId, form);
      setAccounts((prev) => [...prev, created]);
      setForm(emptyForm);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add bank account.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    try {
      await deleteBankAccount(id);
      setAccounts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete bank account.");
    } finally {
      setBusyId(null);
    }
  };

  const handleSetPrimary = async (id: string) => {
    setBusyId(id);
    try {
      const updated = await setPrimaryBankAccount(id);
      setAccounts((prev) => prev.map((a) => (a.id === id ? updated : { ...a, isPrimary: false })));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update primary account.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="px-6 py-10 sm:px-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Payout Bank Accounts</h1>
          <p className="text-slate-500 mt-2">Add the bank account(s) where your store payouts should go.</p>
        </div>

        {error && (
          <p className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2">{error}</p>
        )}

        <section className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Add Bank Account</h2>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <TextField
              label="Account Holder Name"
              value={form.accountHolderName}
              onChange={(v) => setForm((f) => ({ ...f, accountHolderName: v }))}
              required
            />
            <TextField
              label="Bank Name"
              value={form.bankName}
              onChange={(v) => setForm((f) => ({ ...f, bankName: v }))}
              required
            />
            <TextField
              label="Account Number"
              value={form.accountNumber}
              onChange={(v) => setForm((f) => ({ ...f, accountNumber: v }))}
              required
            />
            <TextField
              label="IFSC Code"
              value={form.ifscCode}
              onChange={(v) => setForm((f) => ({ ...f, ifscCode: v.toUpperCase() }))}
              required
            />
            <TextField
              label="Branch Name"
              value={form.branchName ?? ""}
              onChange={(v) => setForm((f) => ({ ...f, branchName: v }))}
            />
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-[#5b4ef9] px-4 py-2 text-sm font-medium text-white hover:bg-[#4a3ee0] disabled:opacity-60"
              >
                {submitting ? "Adding..." : "Add Bank Account"}
              </button>
            </div>
          </form>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Accounts</h2>
          {loading ? (
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </div>
          ) : loadError ? (
            <p className="text-red-600 text-sm">{loadError}</p>
          ) : accounts.length === 0 ? (
            <p className="text-slate-500 text-sm">No bank accounts added yet.</p>
          ) : (
            <div className="space-y-3">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-[#5b4ef9]/10 text-[#5b4ef9]">
                      <Landmark className="w-4 h-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-900 flex items-center gap-2">
                        {account.accountHolderName}
                        {account.isPrimary && (
                          <span className="text-xs font-medium text-amber-600 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Primary
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {account.bankName} • {account.accountNumber} • {account.ifscCode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!account.isPrimary && (
                      <button
                        onClick={() => handleSetPrimary(account.id)}
                        disabled={busyId === account.id}
                        className="text-xs font-medium text-slate-600 hover:text-[#5b4ef9] disabled:opacity-60"
                      >
                        Make primary
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(account.id)}
                      disabled={busyId === account.id}
                      className="text-slate-400 hover:text-red-600 disabled:opacity-60"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm text-slate-700 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/40"
      />
    </div>
  );
}
