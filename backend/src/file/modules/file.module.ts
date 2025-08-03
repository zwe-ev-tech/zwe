import { Module } from '@nestjs/common';
import { FileService } from '../services';
import { S3Module } from './s3.module';

@Module({
  imports: [S3Module],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}