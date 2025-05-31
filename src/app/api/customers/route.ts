// pages/api/customers/index.ts
import { NextResponse } from "next/server";
import { Query, DocumentData } from "firebase-admin/firestore";
import { admin } from "@/lib/firebaseAdmin";
import { cleanText, generateKeywords, generateUrlSafeKey } from "@/lib/utils";

export const runtime = "nodejs"; // Força o uso do runtime Node.js em vez do Edge

const db = admin.firestore();

// GET /api/customers
export async function GET(req: Request) {
    try {
        // Parse query parameters from the request URL
        const { search, offset, size, filterField, filterValue, sort } = Object.fromEntries(new URL(req.url).searchParams.entries());
        const offsetNumber = offset ? parseInt(offset) : 0;
        const limit = size ? parseInt(size) : 10; // Number of items per page

        // Build the base query
        let query: Query<DocumentData> = db.collection("customers");

        // Apply generic filter if filterField is provided.
        if (filterField && filterField !== "all") {
            if (filterValue && filterValue !== "") {
                // If a specific value is provided, match documents exactly
                query = query.where(filterField, "==", filterValue);
            } else {
                // If no value is provided, only return documents where the field is not empty.
                // Using ">" operator with empty string as a workaround.
                query = query.where(filterField, ">", "");
            }
        }

        // If a search term is provided, filter by 'name'
        if (search) {
            // Using a basic range query on "name"
            query = query
                .where("keywords", "array-contains", cleanText(search));
        }

        // Get the total count before pagination
        const totalSnapshot = await query.get();
        const totalCustomers = totalSnapshot.size;

        // Apply pagination: offset and limit
        query = query.offset(offsetNumber).limit(limit);

        console.log("Query:", query.toString());
        if (sort) {
            // Sort by the specified field
            const [field, order] = sort.split(":");
            query = query.orderBy(field, order === "desc" ? "desc" : "asc");
        } else {
            // Default sort by 'createdAt' in descending order
            query = query.orderBy("name", "asc");
        }

        const snapshot = await query.get();

        // Map Firestore documents to our customer objects
        const customers = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            // Ensure date fields are converted (adjust if necessary)
            createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : null,
            updatedAt: doc.data().updatedAt ? doc.data().updatedAt.toDate() : null,
        }));

        // Calculate new offset: if less than limit were returned, there are no more pages
        const newOffset = snapshot.size < limit ? null : offsetNumber + limit;

        return NextResponse.json({ customers, newOffset, totalCustomers }, { status: 200 });
    } catch (error) {
        console.error("Error fetching customers:", error);
        return NextResponse.json({ error: "Erro ao buscar clientes" }, { status: 500 });
    }
}

// POST /api/customers
export async function POST(req: Request) {
    try {
        const data = await req.json();
        if (!data.doc) return NextResponse.json({ error: "CPF é obrigatório" }, { status: 400 });
        data.doc = data.doc.replace(/\D/g, '').substring(0, 11);

        const customersRef = await db.collection("customers")
        // Check if the CPF already exists
        const alreadyExist = await customersRef.where("doc", "==", data.doc).get();
        if (!alreadyExist.empty) return NextResponse.json({ error: "CPF já cadastrado" }, { status: 400 });

        // prepare new docs
        const customerRef = customersRef.doc();
        const token = `${customerRef.id.slice(0, 4)}-${generateUrlSafeKey(24)}`;
        const tokenRef = db.collection("tokens").doc(token);

        // build batch
        const batch = db.batch();
        const now = new Date();

        batch.set(customerRef, {
            ...data,
            keywords: [
                ...generateKeywords(data.name),
                ...generateKeywords(data.doc),
            ],
            id: customerRef.id,
            createdAt: now,
            updatedAt: now,
        });

        batch.set(tokenRef, {
            token,
            id: token,
            customerId: customerRef.id,
            createdAt: now,
            expiresAt: null,
        });

        // commit both writes together
        await batch.commit();

        return NextResponse.json({ id: customerRef.id }, { status: 201 });
    } catch (error) {
        console.log(error)
        console.log(JSON.stringify(error))
        return NextResponse.json({ error: "Erro ao criar cliente" }, { status: 500 });
    }
}