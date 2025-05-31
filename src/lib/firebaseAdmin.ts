// lib/firebaseAdmin.ts
import admin, { storage } from "firebase-admin";
export const runtime = "nodejs"; // Força o uso do runtime Node.js em vez do Edge

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // This is our camelCase key for TypeScript, but we also need snake_case at runtime.
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        } as any), // cast to any to bypass TS complaining about extra keys
    });
}

export { admin, storage };
