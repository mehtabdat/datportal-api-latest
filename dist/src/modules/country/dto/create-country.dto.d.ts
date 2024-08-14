import { Prisma } from '@prisma/client';
export declare class CreateCountryDto implements Prisma.CountryCreateInput {
    name: string;
    vat?: number;
    isoCode: string;
    shortName: string;
    displayName: string;
    phoneCode: string;
    flag?: string;
    defaultCurrency: number;
    enabledLanguages?: number[];
    defaultLanguage: number;
    defaultAreaUnit: number;
    isPublished?: boolean;
}
