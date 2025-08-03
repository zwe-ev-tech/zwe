import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { ConfigService } from '@nestjs/config';
import { dbConfigFactory } from '../configuration/database';
import { File } from '../file/dto/file.entity';
import { Receipt, ReceiptItem } from '../receipt/dto';
import { IDbConfig } from "../configuration/interfaces";

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async (configService: ConfigService) => {
      const configs = dbConfigFactory(configService);
      const env = (configService.get('NODE_ENV') || 'development') as keyof IDbConfig;
      const dbConfig = configs[env];

      const sequelize = new Sequelize({
        ...dbConfig,
        models: [File, Receipt, ReceiptItem],
      } as SequelizeOptions);

      await sequelize.sync({ force: true }); // or .sync({ force: true }) for dev
      return sequelize;
    },
    inject: [ConfigService],
  },
];