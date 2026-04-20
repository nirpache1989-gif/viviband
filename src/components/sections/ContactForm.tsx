"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

export default function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );

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
          <span>\u2192</span>
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
            <a href="mailto:contato@coresdosamba.com">
              contato@coresdosamba.com
            </a>
          </div>
        </div>
        <div className="info-block">
          <div className="info-block__label">{t("info.phone")}</div>
          <div className="info-block__value">+55 71 9 8888 7777</div>
        </div>
        <div className="info-block">
          <div className="info-block__label">{t("info.studio")}</div>
          <div className="info-block__value">
            Salvador, Bahia
            <br />
            Brasil
          </div>
        </div>
        <div className="info-block">
          <div className="info-block__label">{t("info.follow")}</div>
          <div className="socials">
            <a href="#" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
            </a>
            <a href="#" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.6 7.2c-.2-.9-.9-1.6-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8c.2.9.9 1.6 1.8 1.8 1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5 3-5 3z" />
              </svg>
            </a>
            <a href="#" aria-label="Spotify">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth={2} />
                <path
                  d="M7 10c3-1 7-1 10 1M7.5 13c2.5-.8 5.5-.8 8 .5M8 16c2-.5 4-.5 6 .3"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}
