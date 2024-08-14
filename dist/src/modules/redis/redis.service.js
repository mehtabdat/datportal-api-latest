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
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
const constants_1 = require("../../config/constants");
let RedisService = class RedisService {
    constructor() {
        this.redisClient = new ioredis_1.default({
            host: 'localhost',
            port: 6379,
            password: "ASD67adkjad76788ASD",
            name: constants_1.REDIS_DB_NAME,
            db: Number(process.env.REDIS_DB)
        });
    }
    async setex(key, value, expiresInSeconds) {
        await this.redisClient.setex(key, expiresInSeconds, value);
    }
    async set(key, value) {
        await this.redisClient.set(key, value);
    }
    async get(key) {
        return await this.redisClient.get(key);
    }
    async del(key) {
        await this.redisClient.del(key);
    }
};
RedisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RedisService);
exports.RedisService = RedisService;
//# sourceMappingURL=redis.service.js.map