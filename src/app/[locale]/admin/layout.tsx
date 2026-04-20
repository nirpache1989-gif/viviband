"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const adminNav = [
  { href: "/admin", key: "dashboard" },
  { href: "/admin/shows", key: "shows" },
  { href: "/admin/music", key: "music" },
  { href: "/admin/gallery", key: "gallery" },
  { href: "/admin/band-info", key: "bandInfo" },
  { href: "/admin/contact", key: "contactInfo" },
] as const;

export default function AdminLayout({ children }: AdminLayoutProps) {
  const t = useTranslations("admin");
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();

  // Don't show admin layout on login page
  if (pathname.endsWith("/admin/login")) {
    return <>{children}</>;
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push(`/${locale}/admin/login`);
  }

  return (
    <div className="flex min-h-screen bg-bg-primary pt-20">
      {/* Sidebar */}
      <aside className="fixed left-0 top-20 hidden h-[calc(100vh-5rem)] w-56 border-r border-border bg-bg-secondary p-6 md:block">
        <nav className="flex flex-col gap-2">
          {adminNav.map(({ href, key }) => {
            const isActive =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);
            return (
              <Link
                key={key}
                href={href}
                className={`px-3 py-2 font-body text-xs uppercase tracking-[0.15em] transition-colors ${
                  isActive
                    ? "bg-accent-muted text-accent"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-8 w-full px-3 py-2 text-left font-body text-xs uppercase tracking-[0.15em] text-text-secondary transition-colors hover:text-red-400"
        >
          {t("logout")}
        </button>
      </aside>

      {/* Mobile nav */}
      <div className="fixed left-0 right-0 top-20 z-30 flex gap-1 overflow-x-auto border-b border-border bg-bg-secondary px-4 py-2 md:hidden">
        {adminNav.map(({ href, key }) => {
          const isActive =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={key}
              href={href}
              className={`whitespace-nowrap px-3 py-1.5 font-body text-[10px] uppercase tracking-[0.15em] transition-colors ${
                isActive
                  ? "bg-accent-muted text-accent"
                  : "text-text-secondary"
              }`}
            >
              {t(key)}
            </Link>
          );
        })}
      </div>

      {/* Main content */}
      <main className="w-full px-6 py-8 md:ml-56 md:px-10 md:py-10">
        {children}
      </main>
    </div>
  );
}
