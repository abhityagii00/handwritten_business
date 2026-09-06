import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Login page ko protect nahi karna
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Sirf admin pages protect karo
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("wm_admin_session")?.value;

    if (!token) {
      return NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
    }

    const valid = await verifyAdminSession(token);

    if (!valid) {
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );

      response.cookies.delete("wm_admin_session");

      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};