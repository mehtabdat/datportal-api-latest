"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readS3JsonFile = exports.createAWSStreamMetaData = exports.createAWSStream = exports.readFile = exports.getFileStream = exports.uploadFromUrl = exports.uploadFromBuffer = exports.createZipAndUpload = exports.uploadSingle = exports.uploadFile = void 0;
const fs = require("fs");
const S3 = require("aws-sdk/clients/s3");
const archiver = require("archiver");
const common_1 = require("@nestjs/common");
const file_upload_utils_1 = require("./file-upload.utils");
const smartStream_1 = require("./smartStream");
const axios_1 = require("axios");
const fs_1 = require("fs");
function getS3Instance() {
    const bucketName = process.env.AWS_BUCKET_NAME;
    const region = process.env.AWS_BUCKET_REGION;
    const accessKeyId = process.env.S3_BUCKET_ACCESS_KEY;
    const secretAccessKey = process.env.S3_BUCKET_SECRET_KEY;
    const s3 = new S3({
        region,
        accessKeyId,
        secretAccessKey
    });
    return s3;
}
async function uploadFile(files, callback = null) {
    if (!files)
        return;
    if (Array.isArray(files)) {
        await uploadSingle(files, callback);
    }
    else {
        await uploadSingle([files], callback);
    }
}
exports.uploadFile = uploadFile;
async function uploadSingle(files, callback = null) {
    const s3 = getS3Instance();
    const bucketName = process.env.AWS_BUCKET_NAME;
    let allUploads = [];
    files.forEach((item) => {
        var uploadPathBucket = bucketName + '/' + (0, file_upload_utils_1.extractRelativeDirectoryFromFilePath)(item.path, item.filename);
        var readStream = fs.createReadStream(item.path);
        var uploadParams = {
            Bucket: uploadPathBucket,
            Key: item.filename,
            ContentType: item.mimetype,
            Body: readStream,
        };
        let t = s3.upload(uploadParams, function (err, data) {
            if (err) {
                let logger = new common_1.Logger("S3 Upload");
                logger.error("Some error while uploading files to s3 bucket ", err);
            }
            else {
                let logger = new common_1.Logger("S3 Upload");
                logger.log("File has been uploaded to s3 bucket successfully");
                (0, file_upload_utils_1.removeUploadedFiles)(item);
                if (callback) {
                    callback();
                }
            }
        });
        allUploads.push(t);
    });
    return await Promise.all(allUploads);
}
exports.uploadSingle = uploadSingle;
async function createZipAndUpload(sourceKeys, zipFilePath) {
    let logger = new common_1.Logger("S3 ZIP Upload");
    logger.log("Zip file sharing started, path: ", zipFilePath);
    const s3 = getS3Instance();
    const bucketName = process.env.AWS_BUCKET_NAME;
    const archive = archiver('zip', { zlib: { level: 4 } });
    const output = fs.createWriteStream(zipFilePath);
    archive.pipe(output);
    for (const sourceKey of sourceKeys) {
        const params = { Bucket: bucketName, Key: sourceKey };
        try {
            const s3Object = await s3.getObject(params).promise();
            const fileName = sourceKey.split('/').pop();
            archive.append(s3Object.Body, { name: fileName });
        }
        catch (err) {
            logger.error('Error adding object to archive:', err.message);
        }
    }
    archive.finalize();
    output.on('close', async () => {
        logger.log('Zip archive created successfully.');
        const uploadParams = {
            Bucket: bucketName,
            Key: zipFilePath,
            Body: fs.readFileSync(zipFilePath),
        };
        logger.log("Saving Zip file to s3 bucket");
        return s3.upload(uploadParams, function (err, data) {
            if (err) {
                logger.error("Some error while uploading zip file to s3 bucket ", err);
            }
            else {
                logger.log("Zip File has been uploaded to s3 bucket successfully");
                (0, fs_1.unlink)(zipFilePath, (err) => {
                    if (err) {
                        logger.log(" Some error while removing file " + zipFilePath);
                    }
                    logger.log("File " + zipFilePath + " has been removed successfully");
                });
            }
        });
    });
}
exports.createZipAndUpload = createZipAndUpload;
async function uploadFromBuffer(fileBuffer, fileName) {
    const s3 = getS3Instance();
    const bucketName = process.env.AWS_BUCKET_NAME;
    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: 'application/pdf'
    };
    return await s3.upload(params).promise();
}
exports.uploadFromBuffer = uploadFromBuffer;
async function uploadFromUrl(files, path, propertyId, organizationId, callback = null) {
    const s3 = getS3Instance();
    const bucketName = process.env.AWS_BUCKET_NAME;
    let uploadedFilesPath = [];
    let filesIndex = 0;
    for (const item of files) {
        var uploadPathBucket = bucketName + '/' + path;
        let __image = item.split('/').pop();
        let fileName = Date.now() + "_" + Math.floor((Math.random() * 1000) + 1) + "_" + __image.split("?").shift();
        let extension = fileName.split(".")[1];
        if (!extension) {
            fileName = fileName + ".jpeg";
        }
        (0, axios_1.default)({
            method: 'GET',
            url: item,
            responseType: 'arraybuffer'
        }).then(response => {
            var readStream = response.data;
            if (typeof readStream === "string") {
                throw { message: "Expected image, found string" };
            }
            var uploadParams = {
                Bucket: uploadPathBucket,
                Key: fileName,
                Body: readStream
            };
            s3.putObject(uploadParams, function (err, data) {
                if (err) {
                    let logger = new common_1.Logger("S3 Upload");
                    logger.error("Some error while uploading files to s3 bucket ", err);
                }
                else {
                    uploadedFilesPath.push(path + "/" + fileName);
                    let logger = new common_1.Logger("S3 Upload");
                    logger.log("File has been uploaded to s3 bucket successfully");
                }
                if (filesIndex >= files.length - 1) {
                    if (callback && propertyId && organizationId) {
                        callback(propertyId, organizationId, uploadedFilesPath);
                    }
                }
                filesIndex++;
            });
        }).catch(err => {
            filesIndex++;
            let logger = new common_1.Logger("uploadFromUrl");
            logger.error("Some error:", err.message);
        });
    }
    ;
}
exports.uploadFromUrl = uploadFromUrl;
function getFileStream(fileKey) {
    const s3 = getS3Instance();
    const bucketName = process.env.AWS_BUCKET_NAME;
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    };
    return s3.getObject(downloadParams).createReadStream();
}
exports.getFileStream = getFileStream;
async function readFile(fileKey) {
    const s3 = getS3Instance();
    const bucketName = process.env.AWS_BUCKET_NAME;
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    };
    return s3.getObject(downloadParams).promise().then((res) => {
        return res.Body;
    }).catch((err) => {
        console.error("Read File Error", err === null || err === void 0 ? void 0 : err.message);
        return;
    });
}
exports.readFile = readFile;
async function createAWSStream(fileKey, data, { start, end }) {
    return new Promise((resolve, reject) => {
        const bucketName = process.env.AWS_BUCKET_NAME;
        const bucketParams = {
            Bucket: bucketName,
            Key: fileKey
        };
        try {
            const s3 = getS3Instance();
            const stream = new smartStream_1.SmartStream(bucketParams, s3, data.ContentLength, start, end);
            resolve(stream);
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.createAWSStream = createAWSStream;
async function createAWSStreamMetaData(fileKey) {
    return new Promise((resolve, reject) => {
        const bucketName = process.env.AWS_BUCKET_NAME;
        const bucketParams = {
            Bucket: bucketName,
            Key: fileKey
        };
        try {
            const s3 = getS3Instance();
            s3.headObject(bucketParams, (error, data) => {
                if (error) {
                    reject(error);
                    return;
                }
                ;
                resolve(data);
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.createAWSStreamMetaData = createAWSStreamMetaData;
async function readS3JsonFile(fileKey) {
    return new Promise((resolve, reject) => {
        const bucketName = process.env.AWS_BUCKET_NAME;
        const bucketParams = {
            Bucket: bucketName,
            Key: fileKey
        };
        try {
            const s3 = getS3Instance();
            s3.getObject(bucketParams, (error, data) => {
                if (error) {
                    reject(error);
                    return;
                }
                ;
                var json = JSON.parse(data.Body.toString('utf-8'));
                resolve(json);
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.readS3JsonFile = readS3JsonFile;
//# sourceMappingURL=file-management.js.map