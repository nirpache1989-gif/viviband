"use client";

import { useTranslations } from "next-intl";

export type AdminStatusState = "idle" | "saving" | "saved" | "error";

interface Props {
  state: AdminStatusState;
  className?: string;
}

export default function AdminStatus({ state, className }: Props) {
  const t = useTranslations("admin.status");

  if (state === "idle") return null;

  const tone =
    state === "error"
      ? "text-red-400"
      : state === "saved"
        ? "text-accent"
        : "text-text-secondary";

  const label =
    state === "saving"
      ? t("saving")
      : state === "saved"
        ? `${t("saved")} ✓`
        : t("error");

  return (
    <span
      className={`font-body text-xs ${tone} ${className ?? ""}`}
      role="status"
      aria-live="polite"
    >
      {label}
    </span>
  );
}
