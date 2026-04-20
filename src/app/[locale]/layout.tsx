import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { cookies } from "next/headers";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ClientFx from "@/components/fx/ClientFx";
import { getSiteSettings, renderSettingsStyle } from "@/lib/siteSettings";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Cores do Samba",
  description: "Brazilian Samba Band — Salvador, Bahia",
  icons: { icon: "/favicon.ico" },
};

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "pt" | "en")) {
    notFound();
  }

  const [messages, cookieStore, settings] = await Promise.all([
    getMessages(),
    cookies(),
    getSiteSettings(),
  ]);

  const isAdmin = Boolean(cookieStore.get("admin-session")?.value);
  const settingsCss = renderSettingsStyle(settings);

  return (
    <html lang={locale}>
      <head>
        {/* SSR-inject palette + grain so visitors see the chosen look pre-hydration */}
        <style
          id="site-settings"
          dangerouslySetInnerHTML={{ __html: settingsCss }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ClientFx isAdmin={isAdmin} initialSettings={settings} />
          <Header locale={locale} />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
