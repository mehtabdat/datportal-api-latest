import { Project as __Project } from "@prisma/client";
export declare class Project implements Partial<__Project> {
    id: number;
    slug: string;
    title: string;
    departmentId: number | null;
    submissionById: number | null;
    clientId: number | null;
    projectTypeId: number | null;
    referenceNumber: string | null;
    itemListforApproval: string | null;
    instructions: string | null;
    scopeOfWork: string | null;
    projectFilesLink: string | null;
    components: number[];
    authorities: number[];
}
export declare enum ProjectDocumentsTypes {
    "drawings" = "drawings",
    "Requirement Documents" = "requirement_documents",
    "Structural Drawings" = "structural_drawings",
    "Interior Design" = "interior_design",
    "Invoice" = "invoice",
    "Government Document" = "government_document",
    "permit" = "permit",
    "other" = "other"
}
