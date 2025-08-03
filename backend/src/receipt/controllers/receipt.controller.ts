import { Controller, Get, HttpStatus, Param, Res } from "@nestjs/common";
import { FastifyReply } from 'fastify';
import {ReceiptService} from "../services";
import {IReceiptRes} from "common";
import {toIReceiptRes} from "../transformer";

@Controller('receipt')
export class ReceiptController {
    constructor(private readonly receiptService: ReceiptService) {
    }

    @Get('ai/extract-receipt-details/:fileId')
    public async processImage(@Param('fileId') fileId: string, @Res() res: FastifyReply): Promise<IReceiptRes> {
        const { receipt, fileUrl } = await this.receiptService.retrieveReceiptFromImage(fileId);
        return res.status(HttpStatus.OK).send(toIReceiptRes(receipt, fileUrl));
    }
}