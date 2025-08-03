import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileController } from "../file/controllers";
import { S3Module } from "../file/modules/s3.module";
import { FileModule } from "../file/modules/file.module";
import { DatabaseModule } from "../database/database.module";
import { OpenAiModule } from "../open-api/modules/open-ai.module";
import { ReceiptController } from "../receipt";
import { ReceiptModule } from "../receipt/modules/receipt.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [
                '.env.local',
                '.env.development'
            ],
        }),
      DatabaseModule,
      S3Module,
      FileModule,
      ReceiptModule,
      OpenAiModule
    ],
    controllers: [FileController, ReceiptController],
    providers: [],
})
export class AppModule {}