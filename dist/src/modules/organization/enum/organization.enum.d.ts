export declare enum OrganizationDocumentsTypes {
    "Emirates ID / password" = "emirates_id_or_password",
    "Trade Liscense" = "trade_liscense",
    "Supporting documents" = "supporting_documents",
    "other" = "other"
}
export declare const OrganizationScoringStandards: {
    phone: string;
    email: string;
    description: string;
    officeRegistrationNumber: string;
};
export declare const OrganizationScoringPoints: {
    email: number;
    phone: number;
    description: number;
    officeRegistrationNumber: number;
};
export declare const OrganizationStandardsForScoring: {
    description: number;
};
export declare const RequiredDocumentsChecklist: string[];
