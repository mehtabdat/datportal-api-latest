import { Prisma, BulkUploadFormat as __BulkUploadFormat } from "@prisma/client";
export declare class BulkUploadFormat implements __BulkUploadFormat {
    id: number;
    title: string;
    format: Prisma.JsonValue;
    sample: Prisma.JsonValue | null;
    comment: string | null;
    addedDate: Date;
}
