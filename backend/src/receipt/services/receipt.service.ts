import { HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import * as uuid from "short-uuid";
import {Receipt} from "../dto";
import { OpenApiService } from "../../open-api";
import { IReceiptReq, IReceiptRes, S3Folder } from "common";
import { File } from "../../file";
import { IS3OptionAttributes } from "../../configuration/interfaces";

@Injectable()
export class ReceiptService {
    private readonly logger = new Logger(ReceiptService.name);
    private config: IS3OptionAttributes;

    constructor(
      @Inject('S3_CONFIG') config: IS3OptionAttributes,
      private readonly openAiService: OpenApiService
    ) {
        this.config = config;
    }

    /** Retrieve receipt information from image
     *  @param fileUuid
     */
    async retrieveReceiptFromImage(fileUuid: string): Promise<{ receipt: Receipt, fileUrl: string }> {
        this.logger.log('Retrieving receipt information from image', fileUuid);
        try {
            const existingFile = await File.findOne({ where: { uuid: fileUuid } });
            if (!existingFile) {
                throw new HttpException('File does not exist in system.', HttpStatus.NOT_FOUND);
            }
            const key = `${S3Folder.GPT_IMAGES}/${existingFile.dataValues.uuid}-${existingFile.dataValues.name}`;
            const data = await this.openAiService.extractReceiptDetails(key);
            const receipt = await this.addReceipt(existingFile.dataValues.id,{
                ...data,
                items: data.items.map<any>(item => ({
                    name: item.name,
                    price: item.price
                }))
            })
           return { receipt: {
               ...receipt.dataValues,
                   receiptItems: receipt.dataValues.receiptItems?.map(
                     receipt => ({ itemName: receipt.dataValues.itemName, itemCost: receipt.dataValues.itemCost }))
           } as Receipt, fileUrl: `https://${this.config.bucket}.s3.${this.config.region}.amazonaws.com/${key}` }
        } catch (e) {
            this.logger.error(`Error Retrieving receipt information from image: ${(e as Error).message}`);
            throw e;
        }
    }

    /**  Retrieve receipt by file uuid
     * @param fileUuid
     * */
    async getReceipt(fileUuid: string): Promise<Receipt> {
        this.logger.log('Retrieving receipt for file', fileUuid);
        try {
            const receipt = await Receipt.findOne({
                where: { '$file.uuid$': fileUuid },
                include: ['file', 'receiptItems']
            });
            if (!receipt) {
                throw new HttpException('Receipt with given file not found', HttpStatus.NOT_FOUND);
            }
            return receipt;
        } catch (e) {
            this.logger.error(`Error uploading file: ${(e as Error).message}`);
            throw e;
        }
    }

    /** Add Receipt to db
     * @param fileId
     * @param receipt
     */
    async addReceipt(fileId: number, receipt: IReceiptReq): Promise<Receipt> {
        this.logger.log('Adding receipt for file', receipt.vendorName);
        try {
            return Receipt.create({
                fileId: fileId,
                total: receipt.totalCost,
                uuid: uuid.generate(),
                receiptDate: new Date(receipt.creationDate),
                ...receipt,
                receiptItems: receipt.items.map(item => ({
                    uuid: uuid.generate(),
                    itemName: item.name,
                    itemCost: item.price
                }))
            } as unknown as Receipt,
              {
                  include: ['receiptItems']
              })
        } catch (e) {
            this.logger.error(`Error uploading file: ${(e as Error).message}`);
            throw e;
        }
    }

}