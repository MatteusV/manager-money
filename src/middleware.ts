import { NextResponse, type MiddlewareConfig, type NextRequest } from "next/server";
import { verifyJwt } from "./utils/verifyJwt";

const publicRoutes = [
  { path: '/register', whenAuthenticated: 'redirect' },
  { path: '/auth', whenAuthenticated: 'redirect' }
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED = "/auth";


export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const { isAuthenticated } = await verifyJwt(token)

  const { pathname } = request.nextUrl;

  const matchedPublicRoute = publicRoutes.find(route =>
    pathname.startsWith(route.path)
  );

  if (isAuthenticated && matchedPublicRoute && matchedPublicRoute.whenAuthenticated === 'redirect') {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isAuthenticated && !matchedPublicRoute) {
    return NextResponse.redirect(new URL(REDIRECT_WHEN_NOT_AUTHENTICATED, request.url));
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ]
}