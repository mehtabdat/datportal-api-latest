import { BiometricsChecks, BiometricsChecksType } from "@prisma/client";
import { BiometricsEntryType } from "src/config/constants";
import { TypeFromEnumValues } from "src/helpers/common";
export declare class BiometricsFilters implements Partial<BiometricsChecks> {
    mode: BiometricsChecksType;
    fromDate?: string;
    toDate?: string;
    type: TypeFromEnumValues<typeof BiometricsEntryType>;
    userId: number;
    organizationId: number;
}
