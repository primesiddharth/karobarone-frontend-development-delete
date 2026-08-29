"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { NoStoreNotice } from "@/components/dashboard/NoStoreNotice";
import { ApiError } from "@/lib/api-client";
import {
  Domain,
  listDomains,
  addDomain,
  deleteDomain,
  triggerDomainVerification,
  getDomainVerificationStatus,
} from "@/lib/domains";
import {
  CheckCircle2,
  Clock,
  Globe,
  Loader2,
  Trash2,
  XCircle,
} from "lucide-react";

export default function DomainsPage() {
  const { session } = useAuth();

  if (!session?.storeId) return <NoStoreNotice />;

  return <DomainsContent storeId={session.storeId} />;
}

const STATUS_STYLE: Record<
  Domain["status"],
  { label: string; className: string; icon: typeof Clock }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700",
    icon: Clock,
  },
  verified: {
    label: "Verified",
    className: "bg-green-100 text-green-700",
    icon: CheckCircle2,
  },
  failed: {
    label: "Failed",
    className: "bg-red-100 text-red-700",
    icon: XCircle,
  },
};

function DomainsContent({ storeId }: { storeId: string }) {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [domainName, setDomainName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setLoadError("");
    try {
      setDomains(await listDomains(storeId));
    } catch (err) {
      setLoadError(
        err instanceof ApiError ? err.message : "Could not load domains.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainName.trim()) return;
    setError("");
    setSubmitting(true);
    try {
      const created = await addDomain(storeId, domainName.trim());
      setDomains((prev) => [...prev, created]);
      setDomainName("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add domain.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (id: string) => {
    setBusyId(id);
    try {
      const updated = await triggerDomainVerification(id);
      setDomains((prev) => prev.map((d) => (d.id === id ? updated : d)));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Verification failed. Check your DNS records and try again.",
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleCheckStatus = async (id: string) => {
    setBusyId(id);
    try {
      const updated = await getDomainVerificationStatus(id);
      setDomains((prev) => prev.map((d) => (d.id === id ? updated : d)));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not check verification status.",
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    try {
      await deleteDomain(id);
      setDomains((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not remove domain.",
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="px-6 py-10 sm:px-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Custom Domains</h1>
          <p className="text-slate-500 mt-2">
            Connect your own domain and verify it via DNS.
          </p>
        </div>

        {error && (
          <p className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        <section className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Connect a Domain
          </h2>
          <form
            onSubmit={handleAdd}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              placeholder="www.yourbusiness.com"
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/40"
            />
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-[#5b4ef9] px-4 py-2 text-sm font-medium text-white hover:bg-[#4a3ee0] disabled:opacity-60"
            >
              {submitting ? "Adding..." : "Add Domain"}
            </button>
          </form>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Your Domains
          </h2>
          {loading ? (
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </div>
          ) : loadError ? (
            <p className="text-red-600 text-sm">{loadError}</p>
          ) : domains.length === 0 ? (
            <p className="text-slate-500 text-sm">No domains connected yet.</p>
          ) : (
            <div className="space-y-4">
              {domains.map((domain) => {
                const status = STATUS_STYLE[domain.status];
                const StatusIcon = status.icon;
                return (
                  <div
                    key={domain.id}
                    className="rounded-xl border border-slate-200 px-4 py-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="flex size-9 items-center justify-center rounded-lg bg-[#5b4ef9]/10 text-[#5b4ef9] shrink-0">
                          <Globe className="w-4 h-4" />
                        </span>
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {domain.domainName}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </span>
                        {domain.status === "pending" && (
                          <button
                            onClick={() => handleCheckStatus(domain.id)}
                            disabled={busyId === domain.id}
                            className="text-xs font-medium text-slate-600 hover:text-[#5b4ef9] disabled:opacity-60"
                          >
                            Check status
                          </button>
                        )}
                        {domain.status !== "verified" && (
                          <button
                            onClick={() => handleVerify(domain.id)}
                            disabled={busyId === domain.id}
                            className="text-xs font-medium text-[#5b4ef9] hover:underline disabled:opacity-60"
                          >
                            Verify
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(domain.id)}
                          disabled={busyId === domain.id}
                          className="text-slate-400 hover:text-red-600 disabled:opacity-60"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {domain.dnsRecords?.length > 0 && (
                      <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-left text-slate-500">
                              <th className="pb-1 pr-4 font-medium">Type</th>
                              <th className="pb-1 pr-4 font-medium">Name</th>
                              <th className="pb-1 font-medium">Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {domain.dnsRecords.map((record, idx) => (
                              <tr
                                key={idx}
                                className="border-t border-slate-100"
                              >
                                <td className="py-1.5 pr-4 font-mono text-slate-700">
                                  {record.type}
                                </td>
                                <td className="py-1.5 pr-4 font-mono text-slate-700">
                                  {record.name}
                                </td>
                                <td className="py-1.5 font-mono text-slate-700 break-all">
                                  {record.value}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
