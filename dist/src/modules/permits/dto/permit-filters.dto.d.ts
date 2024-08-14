import { Prisma } from '@prisma/client';
import { PermitClientStatus, PermitFinanceStatus } from 'src/config/constants';
import { TypeFromEnumValues } from 'src/helpers/common';
export declare class PermitFiltersDto implements Partial<Prisma.PermitScalarWhereInput> {
    financeStatus?: TypeFromEnumValues<typeof PermitFinanceStatus>;
    clientStatus?: TypeFromEnumValues<typeof PermitClientStatus>;
    fromDate?: string;
    toDate?: string;
    projectId: number;
    clientId: number;
    authorityId: number;
    onlyActive: boolean;
    onlyExpired: boolean;
}
