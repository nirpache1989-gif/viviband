"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { Show } from "@/types/database";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import AdminStatus, {
  type AdminStatusState,
} from "@/components/admin/AdminStatus";

export default function AdminShowsPage() {
  const t = useTranslations("admin");
  const [shows, setShows] = useState<Show[]>([]);
  const [editing, setEditing] = useState<Show | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [status, setStatus] = useState<AdminStatusState>("idle");

  useEffect(() => {
    fetchShows();
  }, []);

  async function fetchShows() {
    const res = await fetch("/api/admin/shows");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) setShows(data);
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = {
      id: editing?.id,
      date: (form.elements.namedItem("date") as HTMLInputElement).value,
      venue: (form.elements.namedItem("venue") as HTMLInputElement).value,
      city: (form.elements.namedItem("city") as HTMLInputElement).value,
      country: (form.elements.namedItem("country") as HTMLInputElement).value,
      ticket_url:
        (form.elements.namedItem("ticket_url") as HTMLInputElement).value ||
        null,
      is_past: (form.elements.namedItem("is_past") as HTMLInputElement)
        .checked,
    };

    setStatus("saving");
    try {
      const method = editing ? "PUT" : "POST";
      const res = await fetch("/api/admin/shows", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
      setEditing(null);
      setIsAdding(false);
      fetchShows();
      window.setTimeout(() => setStatus("idle"), 1500);
    } catch {
      setStatus("error");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t("confirmDelete"))) return;
    try {
      const res = await fetch("/api/admin/shows", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      fetchShows();
    } catch {
      setStatus("error");
    }
  }

  const showForm = isAdding || editing;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-4xl text-text-primary">
          {t("shows")}
        </h1>
        {!showForm && (
          <Button onClick={() => setIsAdding(true)} size="sm">
            + {t("add")}
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card hover={false} className="mb-8 p-6">
          <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-[0.15em] text-text-secondary">
                {t("fields.date")}
              </label>
              <input
                name="date"
                type="datetime-local"
                required
                defaultValue={editing?.date?.slice(0, 16) ?? ""}
                className="w-full border border-border bg-bg-primary px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-[0.15em] text-text-secondary">
                {t("fields.venue")}
              </label>
              <input
                name="venue"
                required
                defaultValue={editing?.venue ?? ""}
                className="w-full border border-border bg-bg-primary px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-[0.15em] text-text-secondary">
                {t("fields.city")}
              </label>
              <input
                name="city"
                required
                defaultValue={editing?.city ?? ""}
                className="w-full border border-border bg-bg-primary px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-[0.15em] text-text-secondary">
                {t("fields.country")}
              </label>
              <input
                name="country"
                defaultValue={editing?.country ?? "Brasil"}
                className="w-full border border-border bg-bg-primary px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-[0.15em] text-text-secondary">
                {t("fields.ticketUrl")}
              </label>
              <input
                name="ticket_url"
                type="url"
                defaultValue={editing?.ticket_url ?? ""}
                className="w-full border border-border bg-bg-primary px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-accent"
              />
              <p className="mt-1 font-body text-[11px] text-text-secondary/70">
                {t("help.ticketUrl")}
              </p>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                name="is_past"
                type="checkbox"
                id="is_past"
                defaultChecked={editing?.is_past ?? false}
                className="accent-accent"
              />
              <label
                htmlFor="is_past"
                className="font-body text-xs uppercase tracking-[0.15em] text-text-secondary"
              >
                {t("fields.isPast")}
              </label>
            </div>
            <div className="col-span-full flex items-center gap-3 pt-2">
              <Button type="submit" size="sm" disabled={status === "saving"}>
                {status === "saving" ? "..." : t("save")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditing(null);
                  setIsAdding(false);
                  setStatus("idle");
                }}
              >
                {t("cancel")}
              </Button>
              <AdminStatus state={status} />
            </div>
          </form>
        </Card>
      )}

      {/* Shows list */}
      <div className="divide-y divide-border">
        {shows.length === 0 && (
          <p className="py-8 text-center font-body text-sm text-text-secondary">
            {t("noResults")}
          </p>
        )}
        {shows.map((show) => (
          <div
            key={show.id}
            className="flex items-center justify-between py-4"
          >
            <div>
              <p className="font-display text-lg text-text-primary">
                {show.venue}
              </p>
              <p className="font-body text-xs text-text-secondary">
                {show.city}, {show.country} &middot;{" "}
                {new Date(show.date).toLocaleDateString()}
                {show.is_past && (
                  <span className="ml-2 text-text-secondary/50">(past)</span>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditing(show)}
              >
                {t("edit")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(show.id)}
              >
                {t("delete")}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
