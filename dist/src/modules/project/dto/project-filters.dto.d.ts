import { Project } from "@prisma/client";
export declare class ProjectFiltersDto implements Partial<Project> {
    title: string;
    slug: string;
    ids: number | number[];
    quoteNumber: string;
    invoiceNumber: string;
    referenceNumber: string;
    projectStateId?: number;
    projectStateSlugs?: string[];
    clientId?: number;
    isClosed?: boolean;
    delayed?: boolean;
    onHold?: boolean;
    fromDate?: string;
    toDate?: string;
    userIds?: number[];
    projectRole?: number;
}
