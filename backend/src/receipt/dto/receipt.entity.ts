import {BaseModel} from "../../common";
import {BelongsTo, Column, DataType, ForeignKey, HasMany, Table} from "sequelize-typescript";
import {ReceiptItem} from "./item.entity";
import {File} from "../../file/dto/file.entity";

@Table({
    tableName: 'receipt'
})
export class Receipt extends BaseModel<Receipt> {
    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    vendorName!: string;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    receiptDate!: Date;

    @Column({
        type: DataType.STRING(5),
        allowNull: false
    })
    currency!: string;

    @Column({
        type: DataType.DOUBLE,
        allowNull: false
    })
    total!: number;

    @Column({
        type: DataType.DOUBLE,
        allowNull: false
    })
    tax!: number;

    @ForeignKey(() => File)
    @Column({
        type: DataType.NUMBER,
        allowNull: false
    })
    fileId!: number;

    @BelongsTo(() => File)
    file!: File;

    @HasMany(() => ReceiptItem, { foreignKey: 'receiptId' })
    receiptItems?: ReceiptItem[];
}