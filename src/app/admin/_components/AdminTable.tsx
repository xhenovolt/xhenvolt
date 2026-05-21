import type { ReactNode } from "react";
import Link from "next/link";

/**
 * Generic admin table shell. Pages provide column defs and rows;
 * the table renders header, body, empty state, and row actions
 * consistently across every CRUD module.
 */

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface RowAction<T> {
  label: string;
  onConfirm?: string;
  variant?: "default" | "danger";
  /** A server action bound to the row id. */
  action: (row: T) => () => Promise<void>;
}

interface AdminTableProps<T extends { id: string }> {
  rows: T[];
  columns: TableColumn<T>[];
  emptyTitle?: string;
  emptyDescription?: string;
  newHref?: string;
  newLabel?: string;
  rowHref?: (row: T) => string;
  rowActions?: RowAction<T>[];
}

export function AdminTable<T extends { id: string }>({
  rows,
  columns,
  emptyTitle = "Nothing here yet",
  emptyDescription = "Click + New above to add the first record.",
  newHref,
  newLabel = "+ New",
  rowHref,
  rowActions,
}: AdminTableProps<T>) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={`px-4 py-3 font-medium ${c.className ?? ""}`}
              >
                {c.header}
              </th>
            ))}
            {rowActions && rowActions.length > 0 && (
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + (rowActions ? 1 : 0)}
                className="px-4 py-12 text-center"
              >
                <div className="text-slate-700 font-medium">{emptyTitle}</div>
                <div className="text-sm text-slate-500 mt-1">
                  {emptyDescription}
                </div>
                {newHref && (
                  <Link
                    href={newHref}
                    className="inline-block mt-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg px-4 py-2"
                  >
                    {newLabel}
                  </Link>
                )}
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50">
              {columns.map((c, ci) => {
                const cell = c.render(row);
                if (ci === 0 && rowHref) {
                  return (
                    <td key={c.key} className="px-4 py-3">
                      <Link
                        href={rowHref(row)}
                        className="font-medium text-slate-900 hover:text-blue-600"
                      >
                        {cell}
                      </Link>
                    </td>
                  );
                }
                return (
                  <td key={c.key} className={`px-4 py-3 ${c.className ?? ""}`}>
                    {cell}
                  </td>
                );
              })}
              {rowActions && rowActions.length > 0 && (
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    {rowActions.map((a) => (
                      <form key={a.label} action={a.action(row)}>
                        <button
                          type="submit"
                          className={
                            a.variant === "danger"
                              ? "text-xs text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md px-2 py-1"
                              : "text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md px-2 py-1"
                          }
                        >
                          {a.label}
                        </button>
                      </form>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
