"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

const FALLBACK_EMAIL = "contato@coresdosamba.com";
const FALLBACK_PHONE = "+55 71 9 8888 7777";

interface ContactFormProps {
  email?: string | null;
  phone?: string | null;
  instagram?: string | null;
  youtube?: string | null;
  facebook?: string | null;
}

function normalizeInstagram(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  const handle = value.replace(/^@/, "").trim();
  return handle ? `https://instagram.com/${handle}` : null;
}

function normalizeUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value}`;
}

export default function ContactForm({
  email,
  phone,
  instagram,
  youtube,
  facebook,
}: ContactFormProps = {}) {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );
  const bookingEmail = email ?? FALLBACK_EMAIL;
  const bookingPhone = phone ?? FALLBACK_PHONE;
  const igUrl = normalizeInstagram(instagram);
  const ytUrl = normalizeUrl(youtube);
  const fbUrl = normalizeUrl(facebook);
  const hasSocials = Boolean(igUrl || ytUrl || fbUrl);

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
      // Trigger fullscreen magenta curtain animation
      window.fxCurtain?.();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="contact__wrap">
      <form className="contact__form" onSubmit={handleSubmit}>
        <div className="field">
          <input type="text" id="name" name="name" placeholder=" " required />
          <label htmlFor="name">{t("name")}</label>
        </div>
        <div className="field">
          <input type="email" id="email" name="email" placeholder=" " required />
          <label htmlFor="email">{t("email")}</label>
        </div>
        <div className="field">
          <input type="text" id="subject" name="subject" placeholder=" " />
          <label htmlFor="subject">{t("subject")}</label>
        </div>
        <div className="field">
          <textarea id="message" name="message" placeholder=" " required />
          <label htmlFor="message">{t("message")}</label>
        </div>
        <button
          type="submit"
          className="contact__submit"
          disabled={status === "sending"}
        >
          {status === "sending" ? t("sending") : t("send")}
          <span>→</span>
        </button>

        {status === "success" && (
          <p className="contact__status contact__status--ok">{t("success")}</p>
        )}
        {status === "error" && (
          <p className="contact__status contact__status--err">{t("error")}</p>
        )}
      </form>

      <aside className="contact__info">
        <div className="info-block">
          <div className="info-block__label">{t("info.booking")}</div>
          <div className="info-block__value">
            <a href={`mailto:${bookingEmail}`}>{bookingEmail}</a>
          </div>
        </div>
        <div className="info-block">
          <div className="info-block__label">{t("info.phone")}</div>
          <div className="info-block__value">{bookingPhone}</div>
        </div>
        <div className="info-block">
          <div className="info-block__label">{t("info.studio")}</div>
          <div className="info-block__value">
            Salvador, Bahia
            <br />
            Brasil
          </div>
        </div>
        {hasSocials && (
          <div className="info-block">
            <div className="info-block__label">{t("info.follow")}</div>
            <div className="socials">
              {igUrl && (
                <a
                  href={igUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                  </svg>
                </a>
              )}
              {ytUrl && (
                <a
                  href={ytUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.6 7.2c-.2-.9-.9-1.6-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8c.2.9.9 1.6 1.8 1.8 1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5 3-5 3z" />
                  </svg>
                </a>
              )}
              {fbUrl && (
                <a
                  href={fbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.5 21v-7h2.5l.4-3.2H13.5V8.8c0-.9.3-1.5 1.6-1.5h1.7V4.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V10.8H8v3.2h2.4V21h3.1z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
