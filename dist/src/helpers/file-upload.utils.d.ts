/// <reference types="express-serve-static-core" />
/// <reference types="multer" />
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
export declare enum FileTypes {
    "images_and_pdf" = "images_and_pdf",
    "images_only" = "images_only",
    "images_and_videos" = "images_and_videos",
    "all_files" = "all_files",
    "json" = "json",
    "images_only_with_svg" = "images_only_with_svg",
    "json_and_excel" = "json_and_excel"
}
type multerConfigOptions = {
    destination?: string;
    limit?: number;
    fileTypes?: keyof typeof FileTypes;
};
export declare function imageFileFilter(req: any, file: any, callback: any): any;
export declare const imageAndPdfFileFilter: (req: any, file: any, callback: any) => any;
export declare const editFileName: (req: any, file: any, callback: any) => void;
export declare const getMulterOptions: (options?: multerConfigOptions) => MulterOptions;
export declare const removeUploadedFiles: (file: Express.Multer.File | Array<Express.Multer.File>) => Promise<boolean>;
export declare const extractRelativePathFromFullPath: (filePath: string) => string;
export declare const extractRelativeDirectoryFromFilePath: (filePath: string, fileName: string) => string;
export declare const isVideo: (file: Express.Multer.File) => boolean;
export {};
