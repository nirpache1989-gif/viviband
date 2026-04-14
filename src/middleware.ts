import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect admin routes (except login)
  const adminRouteMatch = pathname.match(/^\/(pt|en)\/admin(?!\/(login))/);
  if (adminRouteMatch) {
    const adminSession = request.cookies.get("admin-session");
    if (!adminSession?.value) {
      const locale = adminRouteMatch[1];
      return NextResponse.redirect(
        new URL(`/${locale}/admin/login`, request.url)
      );
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(pt|en)/:path*"],
};
