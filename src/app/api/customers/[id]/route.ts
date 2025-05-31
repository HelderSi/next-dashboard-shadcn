import { NextResponse } from "next/server";
import { admin } from "@/lib/firebaseAdmin";
import { generateKeywords } from "@/lib/utils";

export const runtime = "nodejs"; // Força o uso do runtime Node.js

const db = admin.firestore();

// GET /api/customers/:id
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const docRef = db.collection("customers").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        }
        const data = doc.data();

        let customerCardToken = "";
        const tokenRef = db.collection("tokens").where("customerId", "==", id);
        const tokenDoc = await tokenRef.get();
        if (!tokenDoc.empty) {
            const tokenData = tokenDoc.docs[0].data();
            customerCardToken = tokenData.token;
        }

        return NextResponse.json({
            ...data,
            id: data?.id,
            token: customerCardToken,
            createdAt: data?.createdAt ? data.createdAt.toDate() : null,
            updatedAt: data?.updatedAt ? data.updatedAt.toDate() : null,
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching customer:", error);
        return NextResponse.json({ error: "Error fetching customer" }, { status: 500 });
    }
}

// PUT /api/customers/:id
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        //`params` should be awaited. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
        const { id } = await params;
        const data = await req.json();
        const docRef = db.collection("customers").doc(id);
        if (!data.name) {
            return NextResponse.json({ error: "Name é obrigatório" }, { status: 400 });
        }
        if (!data.doc) {
            return NextResponse.json({ error: "CPF é obrigatório" }, { status: 400 });
        }
        data.doc = data.doc.replace(/\D/g, '').substring(0, 11);

        await docRef.update({
            ...data,
            keywords: [
                ...generateKeywords(data.name),
                ...generateKeywords(data.doc)
            ],
            id,
            updatedAt: new Date()
        });
        return NextResponse.json({ id, ...data }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error updating customer" }, { status: 500 });
    }
}

// DELETE /api/customers/:id
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        //`params` should be awaited. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
        const { id } = await params;
        const docRef = db.collection("customers").doc(id);

        await docRef.delete();
        return NextResponse.json({ message: "Customer deleted" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error deleting customer" }, { status: 500 });
    }
}
