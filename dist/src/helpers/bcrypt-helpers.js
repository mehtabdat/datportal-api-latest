"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareHash = exports.generateHash = void 0;
const bcrypt = require("bcrypt");
const saltRounds = 10;
const generateHash = (password) => {
    let hashData = bcrypt.hashSync(password, saltRounds);
    return hashData;
};
exports.generateHash = generateHash;
const compareHash = (password, hash) => {
    let compareResult = bcrypt.compareSync(password, hash);
    return compareResult;
};
exports.compareHash = compareHash;
//# sourceMappingURL=bcrypt-helpers.js.map