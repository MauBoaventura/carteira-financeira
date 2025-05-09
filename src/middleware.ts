import { authConstants } from "@/lib/constants";
import { validateUserCookie } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get(authConstants.userPrefix);
  const isHome = request.nextUrl.pathname === "/";
  const isLogout = request.nextUrl.pathname === "/logout";

  const cookieIsValid = validateUserCookie(userCookie);
  
  if (isLogout) {
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.delete(authConstants.userPrefix);
    return response;
  }

  if (!cookieIsValid) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isHome && cookieIsValid) {
    return NextResponse.redirect(new URL(authConstants.loginSuccessRedirect, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|auth|assets|public|favicon.ico).*)"],
};
