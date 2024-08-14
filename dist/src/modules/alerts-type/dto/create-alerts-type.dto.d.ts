import { Prisma } from '@prisma/client';
export declare class CreateAlertsTypeDto implements Prisma.AlertsTypeCreateInput {
    title: string;
    description?: string;
    slug: string;
    isPublished?: boolean;
}
