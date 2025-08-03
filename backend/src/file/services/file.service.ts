import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { IFileRes } from "common";
import { S3Service } from "./s3.service";
import { File } from "../dto";

@Injectable()
export class FileService {
    private readonly logger = new Logger(FileService.name);

    constructor(private readonly s3Service: S3Service) {
    }

    /**  Process file upload to s3
     * @param file
     * */
    async uploadFile(file: Express.Multer.File): Promise<IFileRes> {
        this.logger.log('Uploading file...');
        try {
            const fileRes = await this.s3Service.uploadFile(file);
            // Add file to storage
            await this.addFile({ uuid: fileRes.uuid, name: fileRes.name });
            return fileRes;
        } catch (e) {
            this.logger.error(`Error uploading file: ${(e as Error).message}`);
            throw e;
        }
    }

    /** Remove file from S3 by uuid
     * @param uuid
     * */
    async removeFile(uuid: string): Promise<void> {
        this.logger.log('Uploading file...');
        try {
            await this.s3Service.removeFile(uuid);
            await this.deleteFile(uuid);
        } catch (e) {
            this.logger.error(`Error uploading file: ${(e as Error).message}`);
            throw e;
        }
    }

    /** Add file to storage
     * @param file
     * */
    private async addFile(file: Partial<File>): Promise<void> {
        this.logger.log('Processing Uploaded file...');
        try {
            const existingFile = await File.findOne({ where: { uuid: file.uuid } });
            if (existingFile) {
                throw new HttpException('File already existed in system.', HttpStatus.BAD_REQUEST);
            }
            await File.create(file as File);
        } catch (e) {
            this.logger.error(`Error uploading file: ${(e as Error).message}`);
            throw e;
        }
    }

    /** Delete file from storage
     * @param uuid
     * */
    private async deleteFile(uuid: string): Promise<void> {
        this.logger.log('Processing Uploaded file...');
        try {
            const existingFile = await File.findOne({ where: { uuid } });
            if (!existingFile) {
                throw new HttpException('File does not exist in system.', HttpStatus.NOT_FOUND);
            }
            await File.destroy({ where: { uuid: uuid } });
        } catch (e) {
            this.logger.error(`Error uploading file: ${(e as Error).message}`);
            throw e;
        }
    }

}