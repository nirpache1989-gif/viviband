"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { ContactInfo } from "@/types/database";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import AdminStatus, {
  type AdminStatusState,
} from "@/components/admin/AdminStatus";

const EMPTY_CONTACT: ContactInfo = {
  id: "",
  email: null,
  phone: null,
};

export default function AdminContactPage() {
  const t = useTranslations("admin");
  const [info, setInfo] = useState<ContactInfo>(EMPTY_CONTACT);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<AdminStatusState>("idle");

  useEffect(() => {
    fetchInfo();
  }, []);

  async function fetchInfo() {
    try {
      const res = await fetch("/api/admin/contact");
      if (res.ok) {
        const data = await res.json();
        if (data && !data.error) setInfo(data);
      }
    } finally {
      setLoaded(true);
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const body = {
      id: info.id,
      email:
        (form.elements.namedItem("email") as HTMLInputElement).value || null,
      phone:
        (form.elements.namedItem("phone") as HTMLInputElement).value || null,
    };

    setStatus("saving");
    try {
      const res = await fetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
      window.setTimeout(() => setStatus("idle"), 1500);
    } catch {
      setStatus("error");
    }
  }

  if (!loaded) {
    return (
      <p className="py-8 font-body text-sm text-text-secondary">…</p>
    );
  }

  return (
    <div>
      <h1 className="mb-8 font-display text-4xl text-text-primary">
        {t("contactInfo")}
      </h1>

      <Card hover={false} className="p-6">
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-[0.15em] text-text-secondary">
                {t("fields.email")}
              </label>
              <input
                name="email"
                type="email"
                defaultValue={info.email ?? ""}
                className="w-full border border-border bg-bg-primary px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-[0.15em] text-text-secondary">
                {t("fields.phone")}
              </label>
              <input
                name="phone"
                defaultValue={info.phone ?? ""}
                className="w-full border border-border bg-bg-primary px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" size="sm" disabled={status === "saving"}>
              {status === "saving" ? "..." : t("save")}
            </Button>
            <AdminStatus state={status} />
          </div>
        </form>
      </Card>
    </div>
  );
}
