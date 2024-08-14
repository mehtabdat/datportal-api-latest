"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVideo = exports.extractRelativeDirectoryFromFilePath = exports.extractRelativePathFromFullPath = exports.removeUploadedFiles = exports.getMulterOptions = exports.editFileName = exports.imageAndPdfFileFilter = exports.imageFileFilter = exports.FileTypes = void 0;
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
const path_1 = require("path");
const helpers_1 = require("./helpers");
const fs_1 = require("fs");
var FileTypes;
(function (FileTypes) {
    FileTypes["images_and_pdf"] = "images_and_pdf";
    FileTypes["images_only"] = "images_only";
    FileTypes["images_and_videos"] = "images_and_videos";
    FileTypes["all_files"] = "all_files";
    FileTypes["json"] = "json";
    FileTypes["images_only_with_svg"] = "images_only_with_svg";
    FileTypes["json_and_excel"] = "json_and_excel";
})(FileTypes = exports.FileTypes || (exports.FileTypes = {}));
function imageFileFilter(req, file, callback) {
    let fileAttributes = { pattern: /\.(jpg|jpeg|png)$/i, plain: "jpg|jpeg|png" };
    if (this && this.fileTypes) {
        let fileTypes = this.fileTypes;
        switch (fileTypes) {
            case 'images_only':
                fileAttributes.pattern = /\.(jpg|jpeg|png)$/i;
                fileAttributes.plain = "jpg|jpeg|png";
                break;
            case 'images_and_videos':
                fileAttributes.pattern = /\.(jpg|jpeg|png|mp4|mov|3gp)$/i;
                fileAttributes.plain = "jpg|jpeg|png|mp4|mov|3gp";
                break;
            case 'images_only_with_svg':
                fileAttributes.pattern = /\.(jpg|jpeg|png|svg)$/i;
                fileAttributes.plain = "jpg|jpeg|png|svg";
                break;
            case 'images_and_pdf':
                fileAttributes.pattern = /\.(jpg|jpeg|png|pdf)$/i;
                fileAttributes.plain = "jpg|jpeg|png|pdf";
                break;
            case 'json':
                fileAttributes.pattern = /\.(json)$/i;
                fileAttributes.plain = "json";
                break;
            case 'json_and_excel':
                fileAttributes.pattern = /\.(json|xlsx|csv)$/i;
                fileAttributes.plain = "jpg|jpeg|png|pdf";
                break;
            case 'all_files':
                fileAttributes.pattern = /^(?:(?!\.(exe|bat|cmd|com|sh|ps1|dll|py|pyc|js|mjs|bsh|bash|pl|php|rb|jar|lnk|zip)$).)*$/i;
                fileAttributes.plain = "regular documents except executable files";
                break;
            default:
                fileAttributes.pattern = /\.(jpg|jpeg|png)$/i;
                fileAttributes.plain = "jpg|jpeg|png";
                break;
        }
    }
    if (!file.originalname.match(fileAttributes.pattern)) {
        return callback(new common_1.HttpException(`File type not allowed! Allowed Extensions ${fileAttributes.plain}`, 415), false);
    }
    callback(null, true);
}
exports.imageFileFilter = imageFileFilter;
;
const imageAndPdfFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return callback(new common_1.HttpException(`Only image and pdf files are allowed! Allowed Extensions jpg|jpeg|png|gif|webp`, 400), false);
    }
    callback(null, true);
};
exports.imageAndPdfFileFilter = imageAndPdfFileFilter;
const editFileName = (req, file, callback) => {
    let name = file.originalname.split('.')[0];
    name = name.slice(0, 60);
    name = (0, helpers_1.generateSEOFriendlyFileName)(name);
    const fileExtName = (0, path_1.extname)(file.originalname);
    const randomName = Date.now();
    callback(null, `${name}-${randomName}${fileExtName}`);
};
exports.editFileName = editFileName;
const getMulterOptions = (options = {}) => {
    const { destination = "public/uploads", limit = 500000, fileTypes = FileTypes["images_only"] } = options, rest = __rest(options, ["destination", "limit", "fileTypes"]);
    const multerOptions = {
        storage: (0, multer_1.diskStorage)({
            destination: function (req, file, callback) {
                let _fullPath = process.cwd() + '/' + destination;
                if (!(0, fs_1.existsSync)(_fullPath)) {
                    (0, fs_1.mkdirSync)(_fullPath, { recursive: true });
                }
                callback(null, _fullPath);
            },
            filename: exports.editFileName,
        }),
        limits: {
            fileSize: limit,
        },
        fileFilter: imageFileFilter.bind(options)
    };
    return multerOptions;
};
exports.getMulterOptions = getMulterOptions;
const removeUploadedFiles = async (file) => {
    if (!file)
        return false;
    if (Array.isArray(file)) {
        file.forEach(function (ele) {
            __removeFiles(ele);
        });
    }
    else {
        __removeFiles(file);
    }
};
exports.removeUploadedFiles = removeUploadedFiles;
const __removeFiles = async (file) => {
    const path = file.path;
    const logger = new common_1.Logger("File Utils");
    try {
        (0, fs_1.unlink)(path, (err) => {
            if (err)
                logger.log(" Some error while removing file " + file.filename);
            logger.log("File " + file.filename + " has been removed successfully");
        });
    }
    catch (err) {
        logger.error(err);
    }
};
const extractRelativePathFromFullPath = (filePath) => {
    return filePath.replace(process.cwd() + "/", '');
};
exports.extractRelativePathFromFullPath = extractRelativePathFromFullPath;
const extractRelativeDirectoryFromFilePath = (filePath, fileName) => {
    let path = filePath.replace(process.cwd() + "/", '');
    return path.replace("/" + fileName, '');
};
exports.extractRelativeDirectoryFromFilePath = extractRelativeDirectoryFromFilePath;
const isVideo = (file) => {
    if (file.originalname.match(/\.(mp4|mov|3gp)$/i)) {
        return true;
    }
    return false;
};
exports.isVideo = isVideo;
//# sourceMappingURL=file-upload.utils.js.map