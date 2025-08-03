import { Module } from '@nestjs/common';
import { ReceiptService } from "../services";
import { OpenAiModule } from "../../open-api/modules/open-ai.module";
import { s3ConfigFactory } from "../../configuration/s3-config";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [OpenAiModule],
  providers: [
    ReceiptService,
    {
      provide: 'S3_CONFIG',
      useFactory: s3ConfigFactory,
      inject: [ConfigService],
    }
  ],
  exports: [ReceiptService],
})
export class ReceiptModule {}