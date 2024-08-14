import { BiometricsJob } from "@prisma/client";
export declare class BiometricsJobFilters implements Partial<BiometricsJob> {
    fromDate?: string;
    toDate?: string;
    status: number;
}
