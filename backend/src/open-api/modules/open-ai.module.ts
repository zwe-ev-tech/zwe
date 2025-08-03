import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OpenApiService } from '../services';
import { openAiConfigFactory } from '../../configuration/open-ai';
import { s3ConfigFactory } from '../../configuration/s3-config';
import { S3Module } from '../../file/modules/s3.module';
import { S3Service } from '../../file';
import { OpenAI } from 'openai';
import { OpenAiConfig } from '../../configuration/interfaces';

@Module({
  imports: [ConfigModule, S3Module],
  providers: [
    {
      provide: OpenAI,
      useFactory: (config: OpenAiConfig) => new OpenAI({ apiKey: config.key }),
      inject: ['OPEN_AI_CONFIG'],
    },
    {
      provide: OpenApiService,
      useFactory: (config, s3Config, s3Service, openai) =>
        new OpenApiService(config, s3Config, s3Service, openai),
      inject: ['OPEN_AI_CONFIG', 'S3_CONFIG', S3Service, OpenAI],
    },
    {
      provide: 'OPEN_AI_CONFIG',
      useFactory: openAiConfigFactory,
      inject: [ConfigService],
    },
    {
      provide: 'S3_CONFIG',
      useFactory: s3ConfigFactory,
      inject: [ConfigService],
    },
  ],
  exports: [OpenApiService],
})
export class OpenAiModule {}