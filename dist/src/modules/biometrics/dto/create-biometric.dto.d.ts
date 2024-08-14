import { BiometricsChecksType, Prisma } from "@prisma/client";
export declare class CreateBiometricDto implements Prisma.BiometricsChecksUncheckedCreateInput {
    mode?: BiometricsChecksType;
    checkIn?: Date;
    userId?: number;
}
