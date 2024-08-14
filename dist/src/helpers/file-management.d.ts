/// <reference types="multer" />
/// <reference types="node" />
/// <reference types="node" />
import * as S3 from 'aws-sdk/clients/s3';
import { SmartStream } from "./smartStream";
export declare function uploadFile(files: Express.Multer.File | Array<Express.Multer.File>, callback?: Function | null): Promise<void>;
export declare function uploadSingle(files: Array<Express.Multer.File>, callback?: Function | null): Promise<any[]>;
export declare function createZipAndUpload(sourceKeys: Array<string>, zipFilePath: string): Promise<void>;
export declare function uploadFromBuffer(fileBuffer: Buffer, fileName: string): Promise<S3.ManagedUpload.SendData>;
export declare function uploadFromUrl(files: Array<string>, path: string, propertyId?: number, organizationId?: number, callback?: Function | null): Promise<void>;
export declare function getFileStream(fileKey: any): import("stream").Readable;
export declare function readFile(fileKey: any): Promise<void | Buffer>;
export declare function createAWSStream(fileKey: string, data: S3.HeadObjectOutput, { start, end }: {
    start: number;
    end: number;
}): Promise<SmartStream>;
export declare function createAWSStreamMetaData(fileKey: string): Promise<S3.HeadObjectOutput>;
export declare function readS3JsonFile(fileKey: string): Promise<unknown>;
