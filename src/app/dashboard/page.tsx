"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Eye } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { AVAILABLE_THEMES } from "@/lib/website-themes";
import { setStoreTheme } from "@/lib/stores";
import { ApiError } from "@/lib/api-client";
import { NoStoreNotice } from "@/components/dashboard/NoStoreNotice";

export default function ThemePickerPage() {
  const { session } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [applying, setApplying] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [appliedThemeId, setAppliedThemeId] = useState<string | null>(null);

  if (!session?.storeId) return <NoStoreNotice />;

  const handleApply = async (themeId: string) => {
    setError("");
    setApplying(themeId);
    try {
      await setStoreTheme(session.storeId as string, themeId);
      setAppliedThemeId(themeId);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not apply theme. Please try again.");
    } finally {
      setApplying(null);
    }
  };

  return (
    <div className="px-6 py-10 sm:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Website Themes</h1>
          <p className="text-slate-500 mt-2">Pick a design for your storefront. You can change this anytime.</p>
        </div>

        {error && (
          <p className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {AVAILABLE_THEMES.map((theme) => {
            const isApplied = appliedThemeId === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => setSelected(theme.id)}
                className={`cursor-pointer rounded-2xl overflow-hidden border bg-white transition-all ${
                  selected === theme.id ? "border-[#5b4ef9] ring-2 ring-[#5b4ef9]/20" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <img src={theme.previewImage} alt={theme.name} className="w-full h-40 object-cover object-top" />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-slate-900">{theme.name}</h2>
                    {isApplied && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                        <Check className="w-3.5 h-3.5" />
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-sm mt-1">{theme.description}</p>

                  <div className="flex gap-2 mt-4">
                    <Link
                      href={theme.route}
                      target="_blank"
                      className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApply(theme.id);
                      }}
                      disabled={applying === theme.id}
                      className="flex-1 rounded-lg bg-[#5b4ef9] px-3 py-2 text-sm font-medium text-white hover:bg-[#4a3ee0] disabled:opacity-60"
                    >
                      {applying === theme.id ? "Applying..." : isApplied ? "Reapply" : "Use this theme"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
