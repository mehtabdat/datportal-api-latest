/// <reference types="node" />
import { Readable, ReadableOptions } from "stream";
import type { S3 } from "aws-sdk";
export declare class SmartStream extends Readable {
    _currentCursorPosition: number;
    _s3DataRange: number;
    _maxContentLength: number;
    _s3: S3;
    _s3StreamParams: S3.GetObjectRequest;
    constructor(parameters: S3.GetObjectRequest, s3: S3, maxLength: number, start: number, end: number, nodeReadableStreamOptions?: ReadableOptions);
    _read(): void;
}
