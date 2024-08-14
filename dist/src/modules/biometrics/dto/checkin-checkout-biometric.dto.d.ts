import { BiometricsChecksType, Prisma } from "@prisma/client";
export declare class CheckInCheckOutBiometricDto implements Prisma.BiometricsChecksUncheckedCreateInput {
    mode?: BiometricsChecksType;
    latitude?: number;
    force: boolean;
    longitude?: number;
    selfie?: string;
    checkIn?: Date;
    userAgent: string;
    userIP?: string;
}
