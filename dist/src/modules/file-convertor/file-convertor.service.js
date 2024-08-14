"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileConvertorService = void 0;
const common_1 = require("@nestjs/common");
const xlsx = require("xlsx");
const csvParser = require("papaparse");
const fs = require("fs");
const file_management_1 = require("../../helpers/file-management");
const fs_1 = require("fs");
let FileConvertorService = class FileConvertorService {
    async convertFileToJSON(fileKey, filePath) {
        const readStream = await (0, file_management_1.readFile)(fileKey);
        if (!readStream) {
            throw {
                message: "No File Found",
                statusCode: 400
            };
        }
        const fileType = fileKey.split('.').pop();
        let fileName = fileKey.split('/').pop();
        fileName = fileName.split(".").shift() + Date.now() + ".json";
        let newFileName = filePath + fileName;
        let jsonData = null;
        if (fileType === 'xlsx') {
            jsonData = await this.parseExcelToJson(readStream);
            await this.saveAndUploadFile(jsonData, filePath, fileName);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        else if (fileType === 'csv') {
            jsonData = await this.parseCsvToJson(readStream);
            await this.saveAndUploadFile(jsonData, filePath, fileName);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        else if (fileType === 'json') {
            newFileName = fileKey;
        }
        return newFileName;
    }
    async saveAndUploadFile(data, filePath, fileName) {
        let __fileLocation = process.cwd() + "/" + filePath;
        if (!(0, fs_1.existsSync)(filePath)) {
            (0, fs_1.mkdirSync)(filePath, { recursive: true });
        }
        fs.writeFileSync(filePath + fileName, JSON.stringify(data, null, 2));
        const fileToUpload = {
            fieldname: "",
            filename: fileName,
            size: 0,
            encoding: 'utf-8',
            mimetype: "application/pdf",
            destination: filePath + "/",
            path: __fileLocation + fileName,
            originalname: fileName,
            stream: undefined,
            buffer: undefined
        };
        await (0, file_management_1.uploadFile)(fileToUpload);
    }
    async parseExcelToJson(buffer) {
        const workbook = xlsx.read(buffer, { type: 'buffer', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: '', raw: false });
        return jsonData;
    }
    async parseCsvToJson(buffer) {
        return new Promise((resolve, reject) => {
            csvParser.parse(buffer.toString(), {
                header: true,
                dynamicTyping: true,
                complete: (results) => {
                    resolve(results.data);
                },
                error: (error) => {
                    reject(error);
                },
            });
        });
    }
};
FileConvertorService = __decorate([
    (0, common_1.Injectable)()
], FileConvertorService);
exports.FileConvertorService = FileConvertorService;
//# sourceMappingURL=file-convertor.service.js.map