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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiometricsJobEventListener = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const biometrics_jobs_dto_1 = require("../dto/biometrics-jobs.dto");
let BiometricsJobEventListener = class BiometricsJobEventListener {
    constructor(propertyQueue) {
        this.propertyQueue = propertyQueue;
    }
    async handleBiometricsJobProcessEvent(event) {
        console.log(event);
    }
};
__decorate([
    (0, event_emitter_1.OnEvent)('biometricsJob.published'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [biometrics_jobs_dto_1.BiometricsJobProcessEvent]),
    __metadata("design:returntype", Promise)
], BiometricsJobEventListener.prototype, "handleBiometricsJobProcessEvent", null);
BiometricsJobEventListener = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)('biometricsJob')),
    __metadata("design:paramtypes", [Object])
], BiometricsJobEventListener);
exports.BiometricsJobEventListener = BiometricsJobEventListener;
//# sourceMappingURL=property-events.listener.js.map