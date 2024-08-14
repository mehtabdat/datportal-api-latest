import { BiometricsJob as __BiometricsJob } from "@prisma/client";
export declare class BiometricsJob implements Partial<__BiometricsJob> {
    id: number;
    file: string;
    status: number;
    isDeleted: boolean;
    addedById: number;
    addedDate: Date;
}
