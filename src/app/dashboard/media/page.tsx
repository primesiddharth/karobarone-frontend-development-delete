"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { NoStoreNotice } from "@/components/dashboard/NoStoreNotice";
import { ApiError } from "@/lib/api-client";
import {
  WebsiteMedia,
  WebsiteMediaType,
  listWebsiteMedia,
  uploadWebsiteMedia,
  deleteWebsiteMedia,
} from "@/lib/website-media";
import { Loader2, Trash2, Upload } from "lucide-react";

export default function WebsiteMediaPage() {
  const { session } = useAuth();

  if (!session?.storeId) return <NoStoreNotice />;

  return <WebsiteMediaContent storeId={session.storeId} />;
}

function WebsiteMediaContent({ storeId }: { storeId: string }) {
  const [media, setMedia] = useState<WebsiteMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [uploading, setUploading] = useState<WebsiteMediaType | null>(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    setLoadError("");
    try {
      setMedia(await listWebsiteMedia(storeId));
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : "Could not load media.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId]);

  const handleUpload = async (type: WebsiteMediaType, file: File) => {
    setError("");
    setUploading(type);
    try {
      const uploaded = await uploadWebsiteMedia(storeId, type, file);
      setMedia((prev) => [...prev.filter((m) => m.type !== type), uploaded]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(null);
    }
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    try {
      await deleteWebsiteMedia(id);
      setMedia((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not remove media.");
    } finally {
      setBusyId(null);
    }
  };

  const logo = media.find((m) => m.type === "logo");
  const banner = media.find((m) => m.type === "banner");

  return (
    <div className="px-6 py-10 sm:px-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Logo & Banner</h1>
          <p className="text-slate-500 mt-2">Upload the brand images shown across your storefront.</p>
        </div>

        {error && (
          <p className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2">{error}</p>
        )}

        {loading ? (
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading...
          </div>
        ) : loadError ? (
          <p className="text-red-600 text-sm">{loadError}</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            <MediaCard
              label="Store Logo"
              hint="Square image, recommended 512×512px"
              media={logo}
              uploading={uploading === "logo"}
              busy={busyId === logo?.id}
              inputRef={logoInputRef}
              onPick={() => logoInputRef.current?.click()}
              onFileSelected={(file) => handleUpload("logo", file)}
              onDelete={() => logo && handleDelete(logo.id)}
            />
            <MediaCard
              label="Store Banner"
              hint="Wide image, recommended 1600×400px"
              media={banner}
              uploading={uploading === "banner"}
              busy={busyId === banner?.id}
              inputRef={bannerInputRef}
              onPick={() => bannerInputRef.current?.click()}
              onFileSelected={(file) => handleUpload("banner", file)}
              onDelete={() => banner && handleDelete(banner.id)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function MediaCard({
  label,
  hint,
  media,
  uploading,
  busy,
  inputRef,
  onPick,
  onFileSelected,
  onDelete,
}: {
  label: string;
  hint: string;
  media?: WebsiteMedia;
  uploading: boolean;
  busy: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onPick: () => void;
  onFileSelected: (file: File) => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-slate-900">{label}</h2>
      <p className="text-xs text-slate-500 mt-1">{hint}</p>

      <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 h-40 flex items-center justify-center overflow-hidden">
        {media ? (
          <img src={media.url} alt={label} className="w-full h-full object-contain" />
        ) : (
          <span className="text-slate-400 text-sm">No image uploaded</span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelected(file);
          e.target.value = "";
        }}
      />

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={onPick}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-lg bg-[#5b4ef9] px-4 py-2 text-sm font-medium text-white hover:bg-[#4a3ee0] disabled:opacity-60"
        >
          <Upload className="w-4 h-4" />
          {uploading ? "Uploading..." : media ? "Replace" : "Upload"}
        </button>
        {media && (
          <button
            onClick={onDelete}
            disabled={busy}
            className="text-slate-400 hover:text-red-600 disabled:opacity-60"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
