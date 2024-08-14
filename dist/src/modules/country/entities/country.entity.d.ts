import { Country as PrismaCountry } from "@prisma/client";
export declare class Country implements Partial<PrismaCountry> {
    id: number;
    name: string;
    vat?: number;
    isoCode: string;
    shortName: string;
    displayName: string | null;
    phoneCode: string | null;
    flag: string | null;
    status: number;
    defaultCurrency: number | null;
    defaultLanguage: number | null;
    enabledLanguages: number[];
    defaultAreaUnit: number | null;
    isPublished: boolean;
    isDeleted: boolean;
    addedDate: Date;
    addedBy: number | null;
    modifiedDate: Date | null;
    modifiedBy: number | null;
    deletedDate: Date | null;
    deletedBy: number | null;
}
