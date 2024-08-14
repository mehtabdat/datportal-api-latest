"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiaryModule = void 0;
const common_1 = require("@nestjs/common");
const diary_service_1 = require("./diary.service");
const diary_controller_1 = require("./diary.controller");
const diary_authorization_service_1 = require("./diary.authorization.service");
let DiaryModule = class DiaryModule {
};
DiaryModule = __decorate([
    (0, common_1.Module)({
        controllers: [diary_controller_1.DiaryController],
        providers: [diary_service_1.DiaryService, diary_authorization_service_1.DiaryAuthorizationService]
    })
], DiaryModule);
exports.DiaryModule = DiaryModule;
//# sourceMappingURL=diary.module.js.map