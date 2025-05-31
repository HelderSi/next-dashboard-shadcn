
// Estratégia de armazenamento no banco
/**
 * _ para separar campos com valores aninhados
 * camelCase para campos simples
 * motivo: 
 *  - facilita a leitura e a escrita de queries
 *  - facilita a exportacao para .csv
 *  - fácil conversão para objetos aninhados
 * a quantidade máxima de caracteres que um campo pode ter no firestore é de aproximadamente 1500 caracteres(1.5KB)
 * Ex:
 * nr35_aso_date: Date; => nr35: { aso: { date: Date } };
 * nr35_aso_certificateUrl: string; => nr35: { aso: { certificateUrl: string } };
 * comumIgreja_bairro: string; => comumIgreja: { bairro: string };
 * livroVerde_numero: string; => livroVerde: { numero: string };
 */

export enum StatusEnum {
    active = 'active',
    inactive = 'inactive'
};

export enum DocTypeEnum {
    CPF = 'cpf'
};


export type ContactType = {
    phone?: string,
    email?: string,
}


export type CustomerModel = {
    id: string,
    imageUrl?: string,
    name: string,
    status: StatusEnum,
    doc: string,
    docType: DocTypeEnum,

    contact: ContactType,

    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date,
    isDeleted?: boolean,
};

