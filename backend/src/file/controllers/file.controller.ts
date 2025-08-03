import {
    Controller, Delete, Param,
    Post,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import {FileService} from "../services";
import { FastifyFileInterceptor } from "../interceptors";
import { IFileRes } from "common";

@Controller('file')
export class FileController {
    constructor(private readonly fileService: FileService) {
    }

    @Post()
    @UseInterceptors(FastifyFileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<IFileRes> {
        return this.fileService.uploadFile(file);
    }

    @Delete(':id')
    async deleteFile(@Param('id') id: string): Promise<void> {
        await this.fileService.removeFile(id);
    }
}