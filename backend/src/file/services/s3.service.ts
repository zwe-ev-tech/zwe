import { Inject, Injectable, Logger } from "@nestjs/common";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as uuid from "short-uuid";
import { IS3OptionAttributes } from "../../configuration/interfaces";
import { FileExtension, IFileRes, S3Folder } from "common";

@Injectable()
export class S3Service {
    private readonly logger = new Logger(S3Service.name);
    private s3: S3Client;
    private config: IS3OptionAttributes;

    constructor(@Inject('S3_CONFIG') config: IS3OptionAttributes) {
        this.config = config;
        this.s3 = new S3Client({
            region: this.config.region,
            forcePathStyle: false,
            credentials: {
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
            },
        });
    }

    /** Upload file to S3
     * @param file
     * */
    async uploadFile(file: Express.Multer.File): Promise<IFileRes> {
        this.logger.log('Uploading file to s3...');
        try {
            const prefix = uuid.generate();
            const key = `${S3Folder.GPT_IMAGES}/${prefix}-${file.originalname}`;
            await this.s3.send(new PutObjectCommand({
                Bucket: this.config.bucket,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype === FileExtension.jpeg ? FileExtension.jpg : FileExtension.png
            }));

            return ({
                uuid: prefix,
                name: file.originalname,
                createdAt: new Date(),
                url: `https://${this.config.bucket}.s3.${this.config.region}.amazonaws.com/${key}`
            });
        } catch (e) {
            this.logger.error(`Error uploading file: ${(e as Error).message}`);
            throw e;
        }
    }

    /** Remove file from s3 by key
     * @param key
     * */
    async removeFile(key: string): Promise<void> {
        this.logger.log(`Removing file from S3: ${key}`);
        try {
            await this.s3.send(
              new DeleteObjectCommand({ Bucket: this.config.bucket, Key: key }),
            );
        } catch (error) {
            this.logger.error(`Removing deleting file: ${(error as Error).message}`);
            throw error;
        }
    }

    /** Get pre-signed-in url by key
     * @param key
     * */
    async getSignedUrl(key: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.config.bucket,
            Key: key,
        });
        const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
        return signedUrl;
    }

}

