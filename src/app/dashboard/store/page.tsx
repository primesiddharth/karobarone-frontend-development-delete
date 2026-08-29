"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { NoStoreNotice } from "@/components/dashboard/NoStoreNotice";
import { ApiError } from "@/lib/api-client";
import { Store, getStore, updateStore, publishStore, unpublishStore } from "@/lib/stores";
import {
  WebsiteSettings,
  getWebsiteSettings,
  updateWebsiteSettings,
} from "@/lib/website-settings";
import { ExternalLink, Loader2 } from "lucide-react";

export default function StoreProfilePage() {
  const { session } = useAuth();

  if (!session?.storeId) return <NoStoreNotice />;

  return <StoreProfileContent storeId={session.storeId} />;
}

function StoreProfileContent({ storeId }: { storeId: string }) {
  const [store, setStore] = useState<Store | null>(null);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [savingStore, setSavingStore] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [storeData, settingsData] = await Promise.all([
          getStore(storeId),
          getWebsiteSettings(storeId).catch(() => null),
        ]);
        if (!cancelled) {
          setStore(storeData);
          setSettings(settingsData ?? { storeId, siteTitle: storeData.name });
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof ApiError ? err.message : "Could not load store details.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [storeId]);

  type EditableStoreField =
    | "name"
    | "contactPerson"
    | "designation"
    | "email"
    | "phoneNumber"
    | "brandTagline"
    | "gstNumber"
    | "panNumber";

  const updateStoreField = (field: EditableStoreField, value: string) => {
    setStore((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const updateSettingsField = (field: keyof WebsiteSettings, value: string) => {
    setSettings((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSaveStore = async () => {
    if (!store) return;
    setError("");
    setSuccess("");
    setSavingStore(true);
    try {
      const updated = await updateStore(storeId, {
        name: store.name,
        contactPerson: store.contactPerson,
        designation: store.designation,
        email: store.email,
        phoneNumber: store.phoneNumber,
        brandTagline: store.brandTagline,
        gstNumber: store.gstNumber,
        panNumber: store.panNumber,
      });
      setStore(updated);
      setSuccess("Store profile saved.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save store profile.");
    } finally {
      setSavingStore(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    setError("");
    setSuccess("");
    setSavingSettings(true);
    try {
      const updated = await updateWebsiteSettings(storeId, {
        siteTitle: settings.siteTitle,
        metaDescription: settings.metaDescription,
        primaryColor: settings.primaryColor,
        timezone: settings.timezone,
        currency: settings.currency,
      });
      setSettings(updated);
      setSuccess("Website settings saved.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save website settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!store) return;
    setError("");
    setSuccess("");
    setPublishing(true);
    try {
      const updated = store.status === "published" ? await unpublishStore(storeId) : await publishStore(storeId);
      setStore(updated);
      setSuccess(updated.status === "published" ? "Store is now live." : "Store unpublished.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update publish status.");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="px-6 py-10 sm:px-10 flex items-center gap-2 text-slate-500 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading store...
      </div>
    );
  }

  if (loadError || !store) {
    return (
      <div className="px-6 py-10 sm:px-10">
        <p className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 max-w-lg">
          {loadError || "Store not found."}
        </p>
      </div>
    );
  }

  return (
    <div className="px-6 py-10 sm:px-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Store Profile</h1>
            <p className="text-slate-500 mt-2">Update your store details, settings, and publish status.</p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full ${
                store.status === "published" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
              }`}
            >
              {store.status === "published" ? "Published" : "Draft"}
            </span>
            {store.publishedUrl && store.status === "published" && (
              <a
                href={store.publishedUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm text-[#5b4ef9] hover:underline"
              >
                View live <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={handleTogglePublish}
              disabled={publishing}
              className="rounded-lg bg-[#5b4ef9] px-4 py-2 text-sm font-medium text-white hover:bg-[#4a3ee0] disabled:opacity-60"
            >
              {publishing ? "Working..." : store.status === "published" ? "Unpublish" : "Publish"}
            </button>
          </div>
        </div>

        {error && (
          <p className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2">{error}</p>
        )}
        {success && (
          <p className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-2">
            {success}
          </p>
        )}

        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Store Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField label="Store Name" value={store.name} onChange={(v) => updateStoreField("name", v)} />
            <TextField
              label="Contact Person"
              value={store.contactPerson}
              onChange={(v) => updateStoreField("contactPerson", v)}
            />
            <TextField
              label="Designation"
              value={store.designation ?? ""}
              onChange={(v) => updateStoreField("designation", v)}
            />
            <TextField label="Email" type="email" value={store.email} onChange={(v) => updateStoreField("email", v)} />
            <TextField
              label="Phone Number"
              type="tel"
              value={store.phoneNumber}
              onChange={(v) => updateStoreField("phoneNumber", v)}
            />
            <TextField
              label="Brand Tagline"
              value={store.brandTagline ?? ""}
              onChange={(v) => updateStoreField("brandTagline", v)}
            />
            {store.businessType === "gst" ? (
              <TextField
                label="GST Number"
                value={store.gstNumber ?? ""}
                onChange={(v) => updateStoreField("gstNumber", v)}
              />
            ) : (
              <TextField
                label="PAN Number"
                value={store.panNumber ?? ""}
                onChange={(v) => updateStoreField("panNumber", v)}
              />
            )}
          </div>
          <button
            onClick={handleSaveStore}
            disabled={savingStore}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {savingStore ? "Saving..." : "Save Store Details"}
          </button>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Website Settings</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField
              label="Site Title"
              value={settings?.siteTitle ?? ""}
              onChange={(v) => updateSettingsField("siteTitle", v)}
            />
            <TextField
              label="Primary Color"
              value={settings?.primaryColor ?? ""}
              onChange={(v) => updateSettingsField("primaryColor", v)}
            />
            <TextField
              label="Timezone"
              value={settings?.timezone ?? ""}
              onChange={(v) => updateSettingsField("timezone", v)}
            />
            <TextField
              label="Currency"
              value={settings?.currency ?? ""}
              onChange={(v) => updateSettingsField("currency", v)}
            />
            <div className="sm:col-span-2">
              <label className="block text-sm text-slate-700 mb-1">Meta Description</label>
              <textarea
                value={settings?.metaDescription ?? ""}
                onChange={(e) => updateSettingsField("metaDescription", e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/40"
              />
            </div>
          </div>
          <button
            onClick={handleSaveSettings}
            disabled={savingSettings}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {savingSettings ? "Saving..." : "Save Website Settings"}
          </button>
        </section>
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-slate-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/40"
      />
    </div>
  );
}
