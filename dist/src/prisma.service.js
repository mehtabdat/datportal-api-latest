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
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    constructor() {
        super({
            errorFormat: 'minimal',
        });
    }
    async onModuleInit() {
        await this.$connect();
    }
    async truncate() {
        let records = await this.$queryRawUnsafe(`SELECT tablename
                                                          FROM pg_tables
                                                          WHERE schemaname = 'public'`);
        records.forEach((record) => this.truncateTable(record['tablename']));
    }
    async truncateTable(tablename) {
        if (tablename === undefined || tablename === '_prisma_migrations') {
            return;
        }
        try {
            await this.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
        }
        catch (error) {
            console.log({ error });
        }
    }
    async resetSequences() {
        let results = await this.$queryRawUnsafe(`SELECT c.relname
       FROM pg_class AS c
                JOIN pg_namespace AS n ON c.relnamespace = n.oid
       WHERE c.relkind = 'S'
         AND n.nspname = 'public'`);
        for (const { record } of results) {
            await this.$executeRawUnsafe(`ALTER SEQUENCE "public"."${record['relname']}" RESTART WITH 1;`);
        }
    }
};
PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
exports.PrismaService = PrismaService;
//# sourceMappingURL=prisma.service.js.map