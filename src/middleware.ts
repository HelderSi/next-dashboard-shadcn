// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const session = request.cookies.get("session")?.value || null;
    const pathname = request.nextUrl.pathname;

    console.log("########")
    console.log("PATHNAME:", pathname);
    console.log("SESSION:", session?.slice(0, 10) + "...");
    // Identifica se a requisição é para a API ou para o frontend
    const isApiRoute = pathname.startsWith("/api");
    const isApiAuthRoute = pathname.startsWith("/api/auth/login");
    // Usando igualdade para a rota de login para maior precisão:
    const isLoginRoute = pathname === "/login";

    console.log("isApiRoute:", isApiRoute, "isApiAuthRoute:", isApiAuthRoute, "isLoginRoute:", isLoginRoute);

    if (!session) {
        if (isApiRoute && !isApiAuthRoute) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!isLoginRoute && !isApiAuthRoute) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    } else {
        if (isApiRoute && !isApiAuthRoute) {
            try {
                //await admin.auth().verifySessionCookie(session, true);
            } catch (error) {
                console.error(error)
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        }
        // Se usuário autenticado tentar acessar /login, redireciona para /
        if (isLoginRoute) {
            console.log("redirecting to home")
            const dashboardUrl = new URL("/", request.url);
            return NextResponse.redirect(dashboardUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",              // exact root
        "/login",         // login page
        "/api/:path*",    // all API
    ],
};