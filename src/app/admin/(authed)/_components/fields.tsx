"use client";
import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Field, Input, Textarea } from "./ui";

/**
 * Reusable admin form primitives.
 *
 * - SlugInput: text input with auto-slugify from a source field
 * - ListField: edit a JSON array via repeated rows
 * - BoolToggle: small inline yes/no
 *
 * All client components — they post via the surrounding form's action.
 */

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function SlugInput({
  name,
  defaultValue,
  sourceFieldName,
  required,
  placeholder,
}: {
  name: string;
  defaultValue?: string;
  sourceFieldName?: string;
  required?: boolean;
  placeholder?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [touched, setTouched] = useState(Boolean(defaultValue));

  React.useEffect(() => {
    if (touched || !sourceFieldName) return;
    // Find the source field directly by name. Using document.querySelector("form")
    // would grab the sidebar logout form (first in the DOM), which has no such
    // field, so slug auto-fill silently never ran.
    const src = document.getElementsByName(sourceFieldName)[0] as
      | HTMLInputElement
      | undefined;
    if (!src) return;
    const onInput = () => setValue(slugify(src.value));
    src.addEventListener("input", onInput);
    return () => src.removeEventListener("input", onInput);
  }, [touched, sourceFieldName]);

  return (
    <Input
      name={name}
      required={required}
      placeholder={placeholder ?? "auto-generated-from-title"}
      value={value}
      onChange={(e) => {
        setTouched(true);
        setValue(slugify(e.target.value));
      }}
    />
  );
}

interface ListItem {
  [k: string]: string | number | boolean | null;
}

interface ListFieldProps<T extends ListItem> {
  name: string; // posted as JSON in this hidden field
  label: string;
  hint?: string;
  defaultItems?: T[];
  itemSchema: Array<{
    key: keyof T & string;
    label: string;
    type?: "text" | "textarea";
    placeholder?: string;
  }>;
  newItem: () => T;
  maxItems?: number;
}

export function ListField<T extends ListItem>({
  name,
  label,
  hint,
  defaultItems,
  itemSchema,
  newItem,
  maxItems,
}: ListFieldProps<T>) {
  const [items, setItems] = useState<T[]>(defaultItems ?? []);

  const update = (i: number, key: keyof T & string, val: string) => {
    setItems((cur) => {
      const next = [...cur];
      next[i] = { ...next[i], [key]: val };
      return next;
    });
  };
  const remove = (i: number) =>
    setItems((cur) => cur.filter((_, idx) => idx !== i));
  const add = () => setItems((cur) => [...cur, newItem()]);
  const canAdd = !maxItems || items.length < maxItems;

  return (
    <Field label={label} hint={hint}>
      <input type="hidden" name={name} value={JSON.stringify(items)} readOnly />
      <div className="space-y-3">
        {items.length === 0 && (
          <div className="text-sm text-slate-500 italic py-2">
            No items yet — click <strong>+ Add</strong> below.
          </div>
        )}
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-slate-50 border border-slate-200 rounded-lg p-3"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="text-xs font-medium text-slate-500">#{i + 1}</div>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-slate-400 hover:text-red-600 transition-colors"
                aria-label="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {itemSchema.map((f) => {
                const v = (item[f.key] ?? "") as string;
                if (f.type === "textarea") {
                  return (
                    <div key={f.key} className="sm:col-span-2">
                      <div className="text-xs text-slate-600 mb-1">{f.label}</div>
                      <Textarea
                        rows={2}
                        value={v}
                        placeholder={f.placeholder}
                        onChange={(e) => update(i, f.key, e.target.value)}
                      />
                    </div>
                  );
                }
                return (
                  <div key={f.key}>
                    <div className="text-xs text-slate-600 mb-1">{f.label}</div>
                    <Input
                      value={v}
                      placeholder={f.placeholder}
                      onChange={(e) => update(i, f.key, e.target.value)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          disabled={!canAdd}
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 border border-dashed border-slate-300 rounded-lg px-3 py-1.5 hover:border-slate-400 transition-colors disabled:opacity-50"
        >
          <Plus className="w-3.5 h-3.5" />
          Add item
        </button>
      </div>
    </Field>
  );
}

export function BoolField({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-start gap-3 text-sm font-medium text-slate-700 cursor-pointer">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 rounded border-slate-300"
      />
      <div>
        <div>{label}</div>
        {hint && <div className="text-xs text-slate-500 mt-0.5">{hint}</div>}
      </div>
    </label>
  );
}

export function StatusPicker({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: boolean;
}) {
  // Treat `published=true` as "published", `published=false` as "draft".
  // Three-state UI: published | draft | (delete = separate action)
  return (
    <Field
      label="Status"
      hint="Drafts are visible only in the admin. Published items appear on the live site."
    >
      <select
        name={name}
        defaultValue={defaultValue === false ? "draft" : "published"}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>
    </Field>
  );
}
