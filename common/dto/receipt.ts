export interface IReceiptRes {
    uuid: string;
    tax: number;
    vendorName: string;
    creationDate: Date;
    currency: string;
    totalCost: number;
    fileUrl: string;
    items: Array<IItemAttributes>;
}

export interface IReceiptReq extends Omit<IReceiptRes, 'uuid' | 'items' | 'fileUrl'>{
    items: Array<Omit<IItemAttributes, 'uuid'>>;
}

export interface IItemAttributes {
    uuid: string;
    name: string;
    price: number;
}