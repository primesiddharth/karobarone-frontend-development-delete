"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { NoStoreNotice } from "@/components/dashboard/NoStoreNotice";
import { ApiError } from "@/lib/api-client";
import {
  Section,
  SectionType,
  listSections,
  createSection,
  updateSection,
  deleteSection,
} from "@/lib/sections";
import { Eye, EyeOff, GripVertical, Loader2, Trash2 } from "lucide-react";

const SECTION_TYPES: SectionType[] = [
  "hero",
  "about",
  "products",
  "usp",
  "testimonials",
  "contact",
  "custom",
];

export default function SectionsPage() {
  const { session } = useAuth();

  if (!session?.storeId) return <NoStoreNotice />;

  return <SectionsContent storeId={session.storeId} />;
}

function SectionsContent({ storeId }: { storeId: string }) {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<SectionType>("custom");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await listSections(storeId);
      setSections(data.sort((a, b) => a.order - b.order));
    } catch (err) {
      setLoadError(
        err instanceof ApiError ? err.message : "Could not load sections.",
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
    if (!title.trim()) return;
    setError("");
    setSubmitting(true);
    try {
      const created = await createSection(storeId, {
        title: title.trim(),
        type,
        order: sections.length,
        visible: true,
      });
      setSections((prev) => [...prev, created]);
      setTitle("");
      setType("custom");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not add section.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleVisible = async (section: Section) => {
    setBusyId(section.id);
    try {
      const updated = await updateSection(section.id, {
        visible: !section.visible,
      });
      setSections((prev) =>
        prev.map((s) => (s.id === section.id ? updated : s)),
      );
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not update section.",
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    try {
      await deleteSection(id);
      setSections((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not delete section.",
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleDrop = async (targetId: string) => {
    const draggedId = dragId;
    setDragId(null);
    if (!draggedId || draggedId === targetId) return;

    const fromIndex = sections.findIndex((s) => s.id === draggedId);
    const toIndex = sections.findIndex((s) => s.id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;

    const reordered = [...sections];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);

    const previous = sections;
    setSections(reordered);
    setReordering(true);
    setError("");
    try {
      await Promise.all(
        reordered.map((section, index) =>
          section.order === index
            ? Promise.resolve(section)
            : updateSection(section.id, { order: index }),
        ),
      );
      setSections(
        reordered.map((section, index) => ({ ...section, order: index })),
      );
    } catch (err) {
      setSections(previous);
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not save new section order.",
      );
    } finally {
      setReordering(false);
    }
  };

  return (
    <div className="px-6 py-10 sm:px-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Website Sections
          </h1>
          <p className="text-slate-500 mt-2">
            Manage the content blocks that make up your storefront's homepage.
          </p>
        </div>

        {error && (
          <p className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        <section className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Add Section
          </h2>
          <form
            onSubmit={handleAdd}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              placeholder="Section title (e.g. Our Story)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/40"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as SectionType)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/40"
            >
              {SECTION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t[0].toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-[#5b4ef9] px-4 py-2 text-sm font-medium text-white hover:bg-[#4a3ee0] disabled:opacity-60"
            >
              {submitting ? "Adding..." : "Add"}
            </button>
          </form>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Homepage Layout
          </h2>
          {loading ? (
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </div>
          ) : loadError ? (
            <p className="text-red-600 text-sm">{loadError}</p>
          ) : sections.length === 0 ? (
            <p className="text-slate-500 text-sm">
              No sections yet. Add your first one above.
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-slate-400">
                Drag a section by its handle to reorder the homepage layout.
              </p>
              {sections.map((section) => (
                <div
                  key={section.id}
                  draggable
                  onDragStart={() => setDragId(section.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(section.id)}
                  className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3 transition-colors ${
                    dragId === section.id
                      ? "border-[#5b4ef9] bg-[#5b4ef9]/5"
                      : "border-slate-200"
                  } ${reordering ? "opacity-60" : ""}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <GripVertical className="w-4 h-4 text-slate-300 shrink-0 cursor-grab active:cursor-grabbing" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {section.title}
                      </p>
                      <p className="text-xs text-slate-500 capitalize">
                        {section.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => handleToggleVisible(section)}
                      disabled={busyId === section.id}
                      className="text-slate-500 hover:text-[#5b4ef9] disabled:opacity-60"
                      title={section.visible ? "Hide section" : "Show section"}
                    >
                      {section.visible ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(section.id)}
                      disabled={busyId === section.id}
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
