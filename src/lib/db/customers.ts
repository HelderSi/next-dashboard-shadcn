import "server-only";

import { cookies } from "next/headers";
import { CustomerModel } from "@/models/Customer";
import { getApiUrl, mapToNestedObject } from "@/lib/utils";


const BASE_URL = getApiUrl('customers/');

async function getCookieHeader() {
    // Obter os cookies da requisição original
    const cookieStore = await cookies();
    return cookieStore.toString(); // Retorna os cookies no formato "key=value; key2=value2"
}

export async function getCustomers({
    search,
    offset = 0,
    pageSize,
    filterField,
    filterValue,
    sort
}: {
    search?: string;
    offset?: number;
    pageSize?: number;
    filterField?: string;
    filterValue?: string;
    sort?: string;
}): Promise<{
    customers: CustomerModel[];
    newOffset: number | null;
    totalCustomers: number;
    pageSize: number;
    filterField?: string;
    filterValue?: string;
    sort?: string;
}> {
    // Monta a URL com query parameters se houver search ou offset
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (offset !== null) params.append("offset", offset.toString());
    if (pageSize) params.append("size", pageSize.toString());
    if (filterField) params.append("filterField", filterField);
    if (filterValue) params.append("filterValue", filterValue)
    if (sort) params.append("sort", sort);

    let url = BASE_URL;
    if ([...params].length) {
        url += `?${params.toString()}`;
    }

    const cookie = await getCookieHeader();

    const res = await fetch(url, {
        cache: "no-store",
        headers: { cookie }, // Envia os cookies manualmente
    });

    if (!res.ok) {
        throw new Error("Erro ao buscar clientes");
    }
    const jsonResult = await res.json();
    const customers = jsonResult.customers.map((customer: any) => mapToNestedObject(customer, '_'));
    return {
        ...jsonResult,
        customers,
    };
}


export async function getCustomerByDocNumber(
    docNumber: string
): Promise<CustomerModel | undefined> {
    const cookie = await getCookieHeader();
    const res = await fetch(`${BASE_URL}/doc/${docNumber}`, {
        cache: "no-store",
        headers: { cookie },
    });
    if (!res.ok) {
        return undefined;
    }
    const jsonResult = await res.json();
    return mapToNestedObject(jsonResult, '_') as CustomerModel;
}

export async function getCustomerById(
    id: string
): Promise<CustomerModel & { token?: string }> {
    const cookie = await getCookieHeader();
    const res = await fetch(`${BASE_URL}/${id}`, {
        cache: "no-store",
        headers: { cookie },
    });
    if (!res.ok) {
        throw new Error("Erro ao buscar cliente");
    }
    const jsonResult = await res.json();
    return mapToNestedObject(jsonResult, '_') as CustomerModel;
}

// Outras funções de delete, create e update seguem a mesma ideia:
export async function deleteCustomerById(id: string) {
    const cookie = await getCookieHeader();

    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: { cookie },
    });
    if (!res.ok) {
        throw new Error("Erro ao excluir cliente");
    }
    return res.json();
}

export async function createCustomer(
    data: CustomerModel
) {
    const cookie = await getCookieHeader();

    const res = await fetch(`${BASE_URL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            cookie,
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const jsonResult = await res.json();
        throw new Error(jsonResult.error || "Erro ao criar cliente");
    }
    const jsonResult = await res.json();
    return mapToNestedObject(jsonResult, '_');
}

export async function updateCustomer(param: {
    id: string;
    data: Partial<CustomerModel>;
}) {
    const cookie = await getCookieHeader();
    const res = await fetch(`${BASE_URL}/${param.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            cookie,
        },
        body: JSON.stringify(param.data),
    });
    if (!res.ok) {
        throw new Error("Erro ao atualizar cliente");
    }
    const jsonResult = await res.json();
    return mapToNestedObject(jsonResult, '_');
}
