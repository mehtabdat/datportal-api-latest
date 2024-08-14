import { BiometricsChecks, BiometricsChecksType } from "@prisma/client";
export declare class Biometric implements Partial<BiometricsChecks> {
    id: number;
    mode: BiometricsChecksType;
    checkIn: Date;
    type: number;
    userId: number;
    addedById: number;
    biometricsJobId: number;
    addedDate: Date;
}
