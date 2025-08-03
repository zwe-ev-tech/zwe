import {IDbConfig} from "./interfaces";
import { Dialect } from 'sequelize/types'
import { OPEN_READWRITE, SqliteDialect } from '@sequelize/sqlite3';
import { ConfigService } from "@nestjs/config";

// Init Db config
export const dbConfigFactory = (config: ConfigService): IDbConfig => ({
    local: {
        dialect: 'sqlite',
        mode: OPEN_READWRITE,
        storage: ':memory:',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    },
    development: {
        username: config.get('DB_USER', ''),
        password: config.get('DB_PASSWORD', ''),
        database: config.get('DB_NAME', ''),
        host: config.get('DB_HOST', '127.0.0.1'),
        port: Number(config.get('DB_PORT', 6501)),
        dialect: config.get('DB_DIALECT') as Dialect,
        logging: false,
        force: true,
    },
});