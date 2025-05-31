import 'server-only';

import { ProductModel, StatusEnum } from '@/models/Product';


const products: ProductModel[] = [{
    id: '1',
    imageUrl: 'https://picsum.photos/seed/keyboard/100/100',
    name: 'Product 1',
    status: StatusEnum.active,
    price: 100,
    stock: 10,
    availableAt: new Date()
}, {
    id: '2',
    imageUrl: 'https://picsum.photos/seed/computer/100/100',
    name: 'Product 2',
    status: StatusEnum.inactive,
    price: 200,
    stock: 20,
    availableAt: new Date()
}, {
    id: '3',
    imageUrl: 'https://picsum.photos/seed/car/100/100',
    name: 'Product 3',
    status: StatusEnum.archive,
    price: 300,
    stock: 30,
    availableAt: new Date(),
}, {
    id: '4',
    imageUrl: 'https://picsum.photos/seed/phone/100/100',
    name: 'Product 4',
    status: StatusEnum.active,
    price: 400,
    stock: 40,
    availableAt: new Date()
}, {
    id: '5',
    imageUrl: 'https://picsum.photos/seed/food/100/100',
    name: 'Product 5',
    status: StatusEnum.inactive,
    price: 500,
    stock: 50,
    availableAt: new Date()
}, {
    id: '6',
    imageUrl: 'https://picsum.photos/seed/book/100/100',
    name: 'Product 6',
    status: StatusEnum.archive,
    price: 600,
    stock: 60,
    availableAt: new Date()
}, {
    id: '7',
    imageUrl: 'https://picsum.photos/seed/tshirt/100/100',
    name: 'Product 7',
    status: StatusEnum.active,
    price: 700,
    stock: 70,
    availableAt: new Date()
}, {
    id: '8',
    imageUrl: 'https://picsum.photos/seed/game/100/100',
    name: 'Product 8',
    status: StatusEnum.inactive,
    price: 800,
    stock: 80,
    availableAt: new Date()
}]


export async function getProducts(
    search: string,
    offset: number
): Promise<{
    products: ProductModel[];
    newOffset: number | null;
    totalProducts: number;
}> {
    if (search) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    products: products.filter(v =>
                        v.name.toLowerCase().includes(search.toLowerCase())
                    ),
                    newOffset: null,
                    totalProducts: 0
                })
            }, 2000);
        });
    }

    if (offset === null) {
        return { products: [], newOffset: null, totalProducts: 0 };
    }

    const moreProducts = products.slice(offset, offset + 5);
    const newOffset = moreProducts.length >= 5 ? offset + 5 : null;

    return {
        products: moreProducts,
        newOffset,
        totalProducts: products.length
    };
}

export async function deleteProductById(id: string) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(id)
        }, 3000);
    });
}

export async function createProduct(data: Pick<ProductModel, "name" | "price">) {
    console.log("adding product: ", data);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(null)
        }, 3000);
    });
}

export async function updateProduct(param: { id: string, data: Pick<ProductModel, "name" | "price"> }) {
    console.log("updating product: ", param.id, param.data);
    return new Promise((resolve, ) => {
        setTimeout(() => {
            resolve(null)
        }, 3000);
    });
}