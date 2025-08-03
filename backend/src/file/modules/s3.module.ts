import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {S3Service} from "../services";
import {s3ConfigFactory} from "../../configuration/s3-config";

@Module({
    imports: [ConfigModule],
    providers: [
        S3Service,
        {
            provide: 'S3_CONFIG',
            useFactory: s3ConfigFactory,
            inject: [ConfigService],
        },
    ],
    exports: [S3Service],
})
export class S3Module {}