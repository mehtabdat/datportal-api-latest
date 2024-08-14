"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDynamicUploadPath = exports.FeedbackResponseArray = exports.FeedbackResponseObject = void 0;
const swagger_1 = require("@nestjs/swagger");
const feedback_entity_1 = require("../entities/feedback.entity");
class FeedbackResponseObject {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FeedbackResponseObject.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], FeedbackResponseObject.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", feedback_entity_1.Feedback)
], FeedbackResponseObject.prototype, "data", void 0);
exports.FeedbackResponseObject = FeedbackResponseObject;
class FeedbackResponseArray {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FeedbackResponseArray.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], FeedbackResponseArray.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true }),
    __metadata("design:type", feedback_entity_1.Feedback)
], FeedbackResponseArray.prototype, "data", void 0);
exports.FeedbackResponseArray = FeedbackResponseArray;
function getDynamicUploadPath() {
    let basepath = "public";
    let currentDate = new Date().toISOString().split('T')[0];
    return basepath + '/feedback/' + currentDate;
}
exports.getDynamicUploadPath = getDynamicUploadPath;
//# sourceMappingURL=feedback.dto.js.map