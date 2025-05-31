import { admin } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

// Use Node.js runtime so that firebase-admin works properly.
export const runtime = "nodejs";

const db = admin.firestore();

// Configuration: List of fields to export (customize as needed)
const exportableFields = [
    {
        key: "name",
        label: "Nome"
    },
    {
        key: "doc",
        label: "CPF"
    },
    {
        key: "contact_phone",
        label: "Telefone"
    },
    {
        key: "contact_email",
        label: "E-mail"
    },
    {
        key: "createdAt",
        label: "Criado em"
    },
];

export async function GET() {
    try {
        // Fetch all documents from the "customers" collection.
        const snapshot = await db.collection("customers").get();
        if (snapshot.empty) {
            return NextResponse.json({ error: "No data available" }, { status: 404 });
        }

        // Map each document to an object containing only the exportable fields.
        const docs = snapshot.docs.map(doc => {
            const data = doc.data();
            // Include the document id as well.
            data.id = doc.id;
            // Convert Firestore Timestamps to Date objects (if applicable)
            if (data.createdAt && typeof data.createdAt.toDate === "function") {
                data.createdAt = data.createdAt.toDate().toISOString();
            }
            if (data.updatedAt && typeof data.updatedAt.toDate === "function") {
                data.updatedAt = data.updatedAt.toDate().toISOString();
            }
            // Create a new object with only the exportable fields.
            const filteredData: Record<string, any> = {};
            exportableFields.forEach(field => {
                filteredData[field.key] = data[field.key] !== undefined ? data[field.key] : "";
            });
            return filteredData;
        });

        // Build CSV header row from the exportableFields list.
        const header = exportableFields.map(field => field.label).join(",");

        // Build CSV rows
        const rows = docs.map(doc => {
            return exportableFields
                .map(field => {
                    let value = doc[field.key];
                    if (typeof value === "string") {
                        // Escape quotes
                        value = value.replace(/"/g, '""');
                        // Wrap in quotes if it contains comma, quote or newline.
                        if (value.includes(",") || value.includes('"') || value.includes("\n")) {
                            value = `"${value}"`;
                        }
                    } else if (value == null) {
                        value = "";
                    } else {
                        value = value.toString();
                    }
                    return value;
                })
                .join(",");
        });

        const csvContent = [header, ...rows].join("\n");

        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": 'attachment; filename="customers.csv"',
            },
        });
    } catch (error) {
        console.error("Error exporting CSV:", error);
        return NextResponse.json({ error: "Error exporting CSV" }, { status: 500 });
    }
}
