import { ResponseSuccess } from "src/common-types/common-types";
import { Client } from "../entities/client.entity";
import { Prisma } from "@prisma/client";
export declare class ClientResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Client;
}
export declare class ClientResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Client;
}
export declare const ClientDefaultAttributes: Prisma.ClientSelect;
