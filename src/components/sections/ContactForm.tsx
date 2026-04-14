"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";

interface ContactFormProps {
  className?: string;
}

export default function ContactForm({ className }: ContactFormProps) {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section data-animate="contact" className={className}>
      <div className="mx-auto max-w-content px-6 py-[var(--section-padding)]">
        <h2 className="mb-12 font-display text-5xl md:text-7xl">
          {t("title")}
        </h2>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block font-body text-xs uppercase tracking-[0.2em] text-text-secondary"
              >
                {t("name")}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full border border-border bg-bg-secondary px-4 py-3 font-body text-sm text-text-primary outline-none transition-colors focus:border-accent"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block font-body text-xs uppercase tracking-[0.2em] text-text-secondary"
              >
                {t("email")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full border border-border bg-bg-secondary px-4 py-3 font-body text-sm text-text-primary outline-none transition-colors focus:border-accent"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="mb-2 block font-body text-xs uppercase tracking-[0.2em] text-text-secondary"
              >
                {t("subject")}
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                className="w-full border border-border bg-bg-secondary px-4 py-3 font-body text-sm text-text-primary outline-none transition-colors focus:border-accent"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-2 block font-body text-xs uppercase tracking-[0.2em] text-text-secondary"
              >
                {t("message")}
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                className="w-full resize-none border border-border bg-bg-secondary px-4 py-3 font-body text-sm text-text-primary outline-none transition-colors focus:border-accent"
              />
            </div>

            <div>
              <Button type="submit" disabled={status === "sending"}>
                {status === "sending" ? t("sending") : t("send")}
              </Button>
            </div>

            {status === "success" && (
              <p className="font-body text-sm text-accent">{t("success")}</p>
            )}
            {status === "error" && (
              <p className="font-body text-sm text-red-400">{t("error")}</p>
            )}
          </form>

          {/* Contact info — populated from Supabase later */}
          <div className="flex flex-col justify-center gap-8 md:pl-12">
            <div>
              <h3 className="mb-2 font-display text-xl text-text-primary">
                {t("email")}
              </h3>
              <p className="font-body text-sm text-text-secondary">
                contact@coresdosamba.com
              </p>
            </div>
            <div className="flex gap-6">
              {["IG", "YT", "FB"].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="font-body text-xs uppercase tracking-[0.2em] text-text-secondary transition-colors hover:text-accent"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
