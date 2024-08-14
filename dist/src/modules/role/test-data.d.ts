/// <reference types="jest" />
import { Prisma } from "@prisma/client";
export declare const moduleName = "Role(s)";
export declare const model = "role";
export declare const recordsMockup: Array<Prisma.RoleCreateManyInput>;
export declare const oneItemOfRecordsMockup: Prisma.RoleCreateManyInput;
export declare const db: {
    role: {
        findMany: jest.Mock<any, any>;
        findUnique: jest.Mock<any, any>;
        create: jest.Mock<any, any>;
        update: jest.Mock<any, any>;
        delete: jest.Mock<any, any>;
        findAll: jest.Mock<any, any>;
        findOne: jest.Mock<any, any>;
    };
};
