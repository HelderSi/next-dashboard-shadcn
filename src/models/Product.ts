
export enum StatusEnum {
    active = 'active',
    inactive = 'inactive',
    archive = 'archive'
};

export type ProductModel = {
    id: string,
    imageUrl: string,
    name: string,
    status: StatusEnum,
    price: number,
    stock: number,
    availableAt: Date
};