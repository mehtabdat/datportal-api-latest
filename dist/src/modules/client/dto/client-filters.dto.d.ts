import { Client } from "@prisma/client";
import { ClientType } from "src/config/constants";
export declare class ClientFiltersDto implements Partial<Client> {
    ids: number | Array<number>;
    name: string;
    type: typeof ClientType[keyof typeof ClientType];
    email: string;
    phone: string;
}
