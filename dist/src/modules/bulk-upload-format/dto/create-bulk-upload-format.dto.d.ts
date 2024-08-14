import { Prisma } from "@prisma/client";
export type attributeTypes = "employeeNumber" | "employeeName" | "date" | "time" | "entry";
export type DataFormatTree = {
    [key in attributeTypes]: {
        name: attributeTypes;
        position: Array<any>;
        alternatePosition1?: Array<any>;
        alternatePosition2?: Array<any>;
        valueType: "string" | "array" | "number" | "comma-separated" | "space-separated" | "comma-abbreviation" | "abbreviation";
        subTypePositon?: Array<any>;
        exist?: boolean;
        encoded?: boolean;
    };
};
export declare class DataFields {
}
export declare class CreateBulkUploadFormatDto implements Prisma.BulkUploadFormatCreateInput {
    title: string;
    format: Prisma.NullTypes.JsonNull | Prisma.InputJsonValue;
    sample?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
    comment?: string;
}
