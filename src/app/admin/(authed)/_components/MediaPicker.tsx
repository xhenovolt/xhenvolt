"use client";
import { useEffect, useState } from "react";
import { ImageIcon, X, Check } from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
  alt: string;
  title: string | null;
}

/**
 * Reusable media field: a URL text input plus a "Pick from library" modal that
 * lists registered media (GET /api/admin/media) and sets the chosen URL.
 *
 * Posts the URL under `name`, so it drops into any existing form action that
 * already reads that field (e.g. iconUrl, logoUrl, avatarUrl).
 */
export function MediaPicker({
  name,
  defaultValue,
  placeholder,
}: {
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || items) return;
    fetch("/api/admin/media")
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => setError("Could not load media library."));
  }, [open, items]);

  const inputBase =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div>
      <div className="flex gap-2">
        <input
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder ?? "https://…/image.png"}
          className={inputBase}
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <ImageIcon className="h-4 w-4" />
          Library
        </button>
      </div>

      {value && (
        <div className="mt-2 flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-10 w-10 rounded border border-slate-200 object-contain" />
          <span className="truncate text-xs text-slate-400">{value}</span>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
              <h3 className="text-sm font-semibold text-slate-800">Media library</h3>
              <button type="button" onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-5">
              {error && <p className="text-sm text-red-600">{error}</p>}
              {!items && !error && <p className="text-sm text-slate-500">Loading…</p>}
              {items && items.length === 0 && (
                <p className="text-sm text-slate-500">
                  No media yet. Add some under <span className="font-medium">Media Library</span>.
                </p>
              )}
              {items && items.length > 0 && (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {items.map((m) => {
                    const selected = m.url === value;
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => {
                          setValue(m.url);
                          setOpen(false);
                        }}
                        className={`group relative overflow-hidden rounded-lg border ${
                          selected ? "border-blue-500 ring-2 ring-blue-200" : "border-slate-200 hover:border-slate-300"
                        }`}
                        title={m.title ?? m.url}
                      >
                        <div className="flex aspect-square items-center justify-center bg-slate-50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={m.url} alt={m.alt} className="h-full w-full object-contain" loading="lazy" />
                        </div>
                        {selected && (
                          <span className="absolute right-1 top-1 rounded-full bg-blue-600 p-0.5 text-white">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
