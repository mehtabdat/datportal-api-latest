export declare class FileConvertorService {
    convertFileToJSON(fileKey: string, filePath: string): Promise<string>;
    private saveAndUploadFile;
    private parseExcelToJson;
    private parseCsvToJson;
}
