import {IItemAttributes, IReceiptRes} from "common";
import {Receipt, ReceiptItem} from "../dto";

export const toIReceiptRes = (receipt: Receipt, fileUrl: string): IReceiptRes => ({
    uuid: receipt.uuid,
    vendorName: receipt.vendorName,
    creationDate: receipt.receiptDate,
    totalCost: receipt.total,
    currency: receipt.currency,
    fileUrl: fileUrl,
    tax: receipt.tax,
    items: receipt?.receiptItems?.map(item => toItemAttributes(item)) || []
});

const toItemAttributes = (receiptItem: ReceiptItem): IItemAttributes => ({
   name: receiptItem.itemName,
   price: receiptItem.itemCost,
   uuid: receiptItem.uuid
});