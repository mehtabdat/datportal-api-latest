"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAvatarImage = void 0;
const canvas_1 = require("canvas");
const fs_1 = require("fs");
const file_management_1 = require("./file-management");
function createAvatarImage(username, fileLocation = "public/users/", filename) {
    if (!username || !filename)
        return;
    let user = username.split(" ");
    let imageText = user[0].charAt(0).toUpperCase() + ((user[1]) ? user[1].charAt(0).toUpperCase() : '');
    const width = 256;
    const height = 256;
    const colors = [
        {
            primary: "#1abc9c",
            secondary: "#000000"
        },
        {
            primary: "#2ecc71",
            secondary: "#ffffff"
        },
        {
            primary: "#3498db",
            secondary: "#ffffff"
        },
        {
            primary: "#9b59b6",
            secondary: "#ffffff"
        },
        {
            primary: "#34495e",
            secondary: "#ffffff"
        },
        {
            primary: "#16a085",
            secondary: "#ffffff"
        },
        {
            primary: "#27ae60",
            secondary: "#ffffff"
        },
        {
            primary: "#2980b9",
            secondary: "#ffffff"
        },
        {
            primary: "#8e44ad",
            secondary: "#ffffff"
        },
        {
            primary: "#2c3e50",
            secondary: "#ffffff"
        },
        {
            primary: "#f1c40f",
            secondary: "#000000"
        },
        {
            primary: "#e67e22",
            secondary: "#000000"
        },
        {
            primary: "#000000",
            secondary: "#ffffff"
        },
        {
            primary: "#e74c3c",
            secondary: "#ffffff"
        },
        {
            primary: "#95a5a6",
            secondary: "#000000"
        },
        {
            primary: "#f39c12",
            secondary: "#000000"
        },
        {
            primary: "#d35400",
            secondary: "#ffffff"
        },
        {
            primary: "#c0392b",
            secondary: "#ffffff"
        }
    ];
    let randomColor = colors[Math.floor(Math.random() * colors.length)];
    const canvas = (0, canvas_1.createCanvas)(width, height);
    const context = canvas.getContext('2d');
    context.fillStyle = randomColor.primary;
    context.arc(128, 128, 128, 0, Math.PI * 2, false);
    context.fill();
    context.font = '600 80pt Menlo';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = randomColor.primary;
    const text = imageText;
    const textWidth = context.measureText(text).width;
    context.fillStyle = randomColor.secondary;
    context.fillText(text, width / 2, 128);
    const buffer = canvas.toBuffer('image/png');
    let __fileLocation = process.cwd() + "/" + fileLocation;
    if (!(0, fs_1.existsSync)(fileLocation)) {
        (0, fs_1.mkdirSync)(fileLocation, { recursive: true });
    }
    (0, fs_1.writeFileSync)(__fileLocation + "/" + filename, buffer);
    const fileToUpload = {
        fieldname: "",
        filename: filename,
        size: 0,
        encoding: 'utf-8',
        mimetype: "image/png",
        destination: fileLocation,
        path: __fileLocation + "/" + filename,
        originalname: filename,
        stream: undefined,
        buffer: undefined
    };
    (0, file_management_1.uploadFile)(fileToUpload);
}
exports.createAvatarImage = createAvatarImage;
//# sourceMappingURL=user-avatar.js.map