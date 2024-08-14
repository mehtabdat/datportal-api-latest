"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findClientIpAddress = exports.loggerOptions = exports.generateSEOFriendlyFileName = void 0;
const generateSEOFriendlyFileName = (fileName) => {
    var temp = fileName.replace(/\s/g, '-');
    temp = temp.toLowerCase();
    temp = temp.replace(/[%'?&*()#+=!/~@$^{}"']/g, '');
    return temp;
};
exports.generateSEOFriendlyFileName = generateSEOFriendlyFileName;
const loggerOptions = () => {
    let options = [];
    switch (process.env.ENVIRONMENT) {
        case "development":
            options = ['error', 'log', 'debug'];
            break;
        case "production":
            options = ['error', 'log'];
            break;
        default:
            options = ['error'];
            break;
    }
    return options;
};
exports.loggerOptions = loggerOptions;
const findClientIpAddress = (req) => {
    let userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    let clientIPAddress = Array.isArray(userIp) ? userIp.join(",") : userIp;
    return clientIPAddress;
};
exports.findClientIpAddress = findClientIpAddress;
//# sourceMappingURL=helpers.js.map