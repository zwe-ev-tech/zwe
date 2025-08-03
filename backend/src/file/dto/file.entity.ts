import {BaseModel} from "../../common";
import {Column, DataType, Table, HasOne} from "sequelize-typescript";
import {Receipt} from "../../receipt/dto/receipt.entity";
import { Status } from "common";

@Table({
    tableName: 'file'
})
export class File extends BaseModel<File> {
    @Column({
        type: DataType.STRING(300),
        allowNull: false
    })
    name!: string;

    @Column({
        type: DataType.ENUM(...Object.values(Status)),
        defaultValue: Status.Active,
        allowNull: false
    })
    status!: Status;

    @HasOne(() => Receipt, 'fileId')
    receipt?: Receipt;
}