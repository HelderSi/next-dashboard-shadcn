'use server';

import { db } from "@/lib/db";
import { CustomerModel } from "@/models/Customer";
import { revalidatePath } from "next/cache";


export async function deleteCustomer(id: string) {
    if (!id)
        return;

    await db.deleteCustomerById(id);
    revalidatePath('/customers');
}


export async function deleteManyCustomerById(ids: string[]) {
    if (!ids.length)
        return;
    const promises = ids.map(id => db.deleteCustomerById(id))
    await Promise.all(promises)
    revalidatePath('/customers');
}


export async function addCustomer(formData: FormData) {
    // Converte o FormData em objeto, ignorando os campos de upload (_file)
    const customerData: Record<string, any> = {};

    formData.forEach((value, key) => {
        if (key.endsWith("_file")) return;
        // Se a chave indica um campo de data, converte para Date
        if (key.endsWith("_data")) {
            customerData[key] = new Date(value.toString());
        } else {
            customerData[key] = typeof value === "string" ? value.trim() : value;
        }
    });

    // Validação dos campos obrigatórios
    if (!customerData.name || !customerData.doc) {
        return { error: "Nome e CPF são obrigatórios." };
    }

    try {
        await db.createCustomer(customerData as CustomerModel);
        revalidatePath("/customers");
        return { success: "Customer adicionado!" };
    } catch (error: any) {
        return { error: error?.message || "Erro ao adicionar customer." };
    }
}

export async function editCustomer(formData: FormData) {
    const id = formData.get("id")?.toString();
    if (!id) return { error: "ID is required" };

    const customerData: Record<string, any> = {};

    formData.forEach((value, key) => {
        if (key.endsWith("_file")) return;
        // Se a chave indica um campo de data, converte para Date
        if (key.endsWith("_data")) {
            customerData[key] = new Date(value.toString());
        } else {
            customerData[key] = typeof value === "string" ? value.trim() : value;
        }
    });


    try {
        await db.updateCustomer({
            id,
            data: customerData as CustomerModel,
        });
        revalidatePath("/customers");
        return { success: "Customer atualizado!" };
    } catch (error: any) {
        console.error("Failed to update customer:", error);
        return { success: false, error: error?.message || "Erro ao atualizar customer." };
    }
}

export async function cpfAlreadyExists(cpf: string) {
    try {
        const customer = await db.getCustomerByDocNumber(cpf);
        return { exists: !!customer };
    } catch (error) {
        console.error("Error checking CPF existence:", error);
        return { exists: false };
    }
}


export async function findCustomerById(id: string) {
    try {
        const customer = await db.getCustomerById(id);
        return { ...customer };
    } catch (error) {
        console.error("Error checking CPF existence:", error);
        return undefined;
    }
}