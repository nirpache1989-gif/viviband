"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import Button from "@/components/ui/Button";

export default function AdminLoginPage() {
  const t = useTranslations("admin");
  const locale = useLocale();
  const router = useRouter();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const password = (
      e.currentTarget.elements.namedItem("password") as HTMLInputElement
    ).value;

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push(`/${locale}/admin`);
    } else {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-6">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center font-display text-4xl text-text-primary">
          {t("title")}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block font-body text-xs uppercase tracking-[0.2em] text-text-secondary"
            >
              {t("password")}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              className="w-full border border-border bg-bg-secondary px-4 py-3 font-body text-sm text-text-primary outline-none transition-colors focus:border-accent"
            />
          </div>

          {error && (
            <p className="font-body text-xs text-red-400">
              {t("loginError")}
            </p>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? "..." : t("login")}
          </Button>
        </form>
      </div>
    </div>
  );
}
