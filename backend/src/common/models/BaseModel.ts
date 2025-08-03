import {Column, CreatedAt, DataType, Model,PrimaryKey,AutoIncrement} from "sequelize-typescript";

export class BaseModel<T extends Model> extends Model<T>{
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        allowNull: false,
        unique: true,
        primaryKey: true,
    })
    declare id: number;

    @Column({
        type: DataType.STRING(28),
        allowNull: false,
        unique: true
    })
    uuid!: string;

    @CreatedAt
    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'creationDate',
        defaultValue: DataType.NOW,
    })
    creationDate!: Date;
}