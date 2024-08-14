import { OrganizationMetaKeys } from "../types/Organization.types";
export declare class OrganizationMeta {
    key: keyof typeof OrganizationMetaKeys;
    value: any;
}
export declare class UpdateOrganizationMetaDto {
    orgMeta: Array<OrganizationMeta>;
}
export declare class DeleteOrganizationMetaDto {
    id: number;
}
export declare class DeleteOrganizationMetaByKeyDto {
    key: keyof typeof OrganizationMetaKeys;
}
