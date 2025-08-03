import { FileExtension, FileUploadErrorType } from "../enums";

export interface IFileReq {
    name: string;
    size: number;
    extension: FileExtension;
    contents: ArrayBuffer;
}
export interface IFileUploadRes extends Omit<IFileReq, 'contents'>{
    uuid: string;
}
export interface IFileRes {
    uuid: string;
    name: string;
    createdAt: Date;
    url: string;
}

export interface IFileErrorRes {
    code?: FileUploadErrorType;
    message: string;
}