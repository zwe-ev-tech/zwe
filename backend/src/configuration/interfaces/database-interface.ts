export interface IDbInMemoryConfigOptions {
    dialect: any;
    storage: ':memory:',
    mode: number,
    pool: Record<string, unknown>,
}

export interface IDbConfigOptions {
    username: string;
    password: string;
    database: string;
    host: string;
    port: number;
    dialect: string;
    logging: boolean | Function;
    force: boolean;
}

export interface IDbConfig {
    local: IDbInMemoryConfigOptions;
    development: IDbConfigOptions;
    production?: IDbConfigOptions;
}