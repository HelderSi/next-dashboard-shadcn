import { NextResponse } from "next/server";
import { admin } from "@/lib/firebaseAdmin";

export const runtime = "nodejs"; // Força o uso do runtime Node.js

const db = admin.firestore();

// GET /api/customers/doc/:doc
export async function GET(
    req: Request, 
    { params }: { params: Promise<{ doc: string }> }
) {
    try {
        const { doc: docNumber } = await params;
        const docRef = db.collection("customers");

        console.log("Fetching customer with doc:", docNumber);

        const snapshot = await docRef.where("doc", "==", docNumber).get();
        if (snapshot.empty) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        }
        const data = snapshot.docs[0].data();
        return NextResponse.json({
            ...data,
            id: data.id,
            createdAt: data.createdAt ? data.createdAt.toDate() : null,
            updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
        }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error fetching customer" }, { status: 500 });
    }
}