import { FileExtension } from "../enums";

export const ALLOWED_MINETYPE = new Set([FileExtension.jpg, FileExtension.jpeg, FileExtension.png]);

export const ALLOWED_DIMENSION = {
  width: 500,
  height: 500
};