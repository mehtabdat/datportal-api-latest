import { InvoiceItem, QuotationMilestone, TaxRate } from '@prisma/client';
export declare const generateUUID: () => any;
export type TypeFromEnumValues<T extends object> = T[keyof T];
export declare function getEnumKeyByEnumValue(myEnum: any, enumValue: number | string): string;
export declare const toSentenceCase: (str: string) => string;
export declare const slugify: (value?: string, upper?: boolean) => any;
export declare const camelToSnakeCase: (str: any) => any;
export declare const generateOTP: (phone?: string) => number;
export declare function getEnumKeyByValue<T>(__enum: T, value: string): string;
export declare const convertToStandardTimeFormat: (durationInSeconds: number) => string;
export declare function addDaysToCurrentDate(days: number): Date;
export declare function addDaysToDate(date: string | Date, days: number): Date | "No Date Provided";
export declare function validateRecaptcha(token: string, ip: string): Promise<boolean>;
export declare function extractURLsFromString(message: string): RegExpMatchArray;
export declare function getMinutesDiff(date1: Date, date2: Date): number;
export declare function getBusinessMinutesDiff(requestDate: any, replyDate: any): number;
export declare function getDifferenceInDays(startDate: string | Date, endDate: string | Date): number;
export declare function convertDate(dt: string | number | Date, format?: "dd/mm/yy" | "dd-mm-yy" | "dd mm yy" | "dd M yy" | "dd M,yy" | "dd MM,yy" | "dd MM yy" | "M dd,yy" | "MM dd,yy" | "M dd yy" | "MM dd yy" | "dd M,yy-t" | "MM yy" | "yy-mm-dd"): string;
export declare function isSameDay(date1: Date, date2: Date): boolean;
export declare function isSameMonthYear(date1: Date, date2: Date): boolean;
export declare function isWeekend(date: Date): boolean;
export declare function calculateTotalHours(startDate: Date, endDate: Date): number;
export declare function getDayRange(date: Date): {
    dayStart: Date;
    dayEnd: Date;
};
export declare function isDateInRange(givenDate: Date, fromDate: Date, toDate: Date): boolean;
export declare function generateRandomName(length?: number): string;
export declare function sleep(duration?: number): Promise<void>;
export declare function extractIds(text: string): number[];
export declare function getTaxData(lineItems: Array<QuotationMilestone & {
    TaxRate: Partial<TaxRate>;
}> | Array<InvoiceItem & {
    TaxRate: Partial<TaxRate>;
}>): [number, {
    rate: number;
    title: string;
    totalTax: number;
}][];
