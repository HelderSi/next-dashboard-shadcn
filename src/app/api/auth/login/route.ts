// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { admin } from "@/lib/firebaseAdmin";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const idToken = body.idToken;
        if (!idToken) {
            return NextResponse.json({ error: "Missing token" }, { status: 400 });
        }
        // Set session duration (e.g., 5 days)
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // milliseconds

        // Create a session cookie using the Firebase Admin SDK.
        const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
        console.log(sessionCookie)
        // Define cookie options (HTTP-only, secure, sameSite)
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: expiresIn / 1000, // seconds
            path: "/",
            sameSite: "strict" as const,
        };

        const response = NextResponse.json({ success: true });
        response.cookies.set("session", sessionCookie, cookieOptions);
        return response;
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
