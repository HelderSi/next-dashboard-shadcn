import { admin } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const db = admin.firestore();

export async function GET() {
    try {
        const snapshot = await db.collection("customers").get();
        const totalCustomers = snapshot.size;
        const activeCustomers = snapshot.docs.filter(doc => {
            const data = doc.data();
            // Assuming 'active' is a boolean field in the customer document.
            return data.status === "active"; // Adjust this condition based on your schema
        }).length;
        // Build the statistics object.
        const stats = {
            totalCustomers,
            activeCustomers,
            inactiveCustomers: totalCustomers - activeCustomers,
        };

        return NextResponse.json(stats, { status: 200 });
    } catch (error) {
        console.error("Error fetching customer stats:", error);
        return NextResponse.json(
            { error: "Error fetching customer stats" },
            { status: 500 }
        );
    }
}
