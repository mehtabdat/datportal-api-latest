import { Prisma } from "@prisma/client";
import { UserDocumentsTypes } from "../types/user.types";
export declare class UpdateUserDocuments implements Prisma.UserDocumentUpdateInput {
    documentId: number;
    title?: string;
    documentType: UserDocumentsTypes;
}
