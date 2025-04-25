import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicPaths = ["/login"];
  const isPublicPath = publicPaths.includes(path);

  const privatePaths = [
    "/",
    "/users",
    "/categories",
    "/orders",
    "/orders/:id",
    "/products",
    "/products/add",
    "/products/update/:id",
  ];
  const isPrivatePath = privatePaths.includes(path);

  const token = request.cookies.get("token")?.value;

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  if (isPrivatePath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
}

export const config = {
  matcher: [
    "/login",
    "/",
    "/users",
    "/categories",
    "/orders",
    "/orders/:id",
    "/products",
    "/products/add",
    "/products/update/:id",
  ],
};
