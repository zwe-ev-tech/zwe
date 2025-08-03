import {
  CallHandler,
  ExecutionContext,
  Inject,
  mixin,
  NestInterceptor,
  Optional,
  Type,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import multer from 'fastify-multer';
import { Options, Multer } from 'multer';
import { FastifyRequest } from 'fastify';
import sharp from 'sharp';

import { FileExtension, ALLOWED_MINETYPE, ALLOWED_DIMENSION, FileUploadErrorType } from "common";

type MulterInstance = any;

export function FastifyFileInterceptor(
  fieldName: string,
  localOptions: Options = {},
): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    protected multer: MulterInstance;

    constructor(
      @Optional()
      @Inject('MULTER_MODULE_OPTIONS')
      options: Multer,
    ) {
      this.multer = (multer as any)({
        ...options,
        ...localOptions,
        storage: multer.memoryStorage(),
        // To filter out image mine-type and dimension
        fileFilter: (req: FastifyRequest, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void,) => {
          // Check for mine type
          if (!ALLOWED_MINETYPE.has(file.mimetype as FileExtension)) {
            return cb(
              new BadRequestException(
                {
                  code: FileUploadErrorType.Invalid_Mine_Types,
                  message: 'Only JPG, JPEG, and PNG image files are allowed'
                },
              ),
              false,
            );
          }
          cb(null, true);
        },
      });
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const ctx = context.switchToHttp();
      const request = ctx.getRequest();
      const response = ctx.getResponse();

      await new Promise<void>((resolve, reject) =>
        this.multer.single(fieldName)(request, response, (err: any) => {
          if (err) {
            return reject(err);
          }
          resolve();
        }),
      );

      // Check image dimensions
      const file = request.file as Express.Multer.File;

      if (!file || !file.buffer) {
        throw new BadRequestException({
          code: FileUploadErrorType.Failed,
          message: 'File upload failed'
        });
      }

      // Check Dimension
      try {
        const { width, height } = await sharp(file.buffer).metadata();
        if (!width || !height || width < ALLOWED_DIMENSION.width || height < ALLOWED_DIMENSION.height) {
          throw new BadRequestException(
            {
              code: FileUploadErrorType.Invalid_Dimensions,
              message: 'Image must have at least 500x500 pixels'
            }
          );
        }
      } catch (err) {
        throw new BadRequestException({
          code: FileUploadErrorType.Invalid_Dimensions,
          message: 'Failed to process image'
        });
      }

      return next.handle();
    }
  }

  return mixin(MixinInterceptor);
}