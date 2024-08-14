import { Prisma } from "@prisma/client";
export declare class CreateBiometricsJobDto implements Partial<Prisma.BiometricsJobUncheckedCreateInput> {
    title?: string;
    file?: string;
    uploadFormatId?: number;
}
