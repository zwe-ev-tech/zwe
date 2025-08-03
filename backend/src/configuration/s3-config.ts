import {IS3OptionAttributes} from "./interfaces";
import { ConfigService } from '@nestjs/config';

// Init S3 Options
export const s3ConfigFactory = (configService: ConfigService): IS3OptionAttributes => ({
    accessKeyId: configService.get<string>('AWS_ID') || '',
    secretAccessKey: configService.get<string>('AWS_SECRET') || '',
    bucket: configService.get<string>('S3_BUCKET_NAME') || '',
    region: configService.get<string>('AWS_REGION') || '',
});