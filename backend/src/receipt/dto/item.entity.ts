import {BaseModel} from "../../common";
import {Column, DataType, ForeignKey, BelongsTo, Table} from "sequelize-typescript";
import {Receipt} from "./receipt.entity";

@Table({
    tableName: 'receipt_items'
})
export class ReceiptItem extends BaseModel<ReceiptItem> {
    @ForeignKey(() => Receipt)
    @Column({
        type: DataType.NUMBER,
        allowNull: false
    })
    receiptId!: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    itemName!: string;

    @Column({
        type: DataType.DOUBLE,
        allowNull: false
    })
    itemCost!: number;

    @BelongsTo(() => Receipt, { targetKey: 'id' })
    receipt?: Receipt;
}