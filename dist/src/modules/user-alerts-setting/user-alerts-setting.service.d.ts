import { AuthenticatedUser } from 'src/authentication/jwt-payload';
import { PrismaService } from 'src/prisma.service';
import { CreateUserAlertsSettingDto } from './dto/create-user-alerts-setting.dto';
import { UpdateUserAlertsSettingDto } from './dto/update-user-alerts-setting.dto';
export declare class UserAlertsSettingService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createOrUpdate(createAndUpdateData: CreateUserAlertsSettingDto | UpdateUserAlertsSettingDto, user: AuthenticatedUser): Promise<{
        id: number;
        userId: number;
        alertsTypeId: number;
        desktop: boolean;
        mobile: boolean;
        email: boolean;
        app: boolean;
        addedDate: Date;
        modifiedDate: Date;
    }>;
    findOne(userAlertsTypeId: number, userId: number): Promise<{
        id: number;
        userId: number;
        alertsTypeId: number;
        desktop: boolean;
        mobile: boolean;
        email: boolean;
        app: boolean;
        addedDate: Date;
        modifiedDate: Date;
    }>;
    findBySlug(userAlertsTypeSlug: string, userId: number): Promise<{
        AlertsType: {
            id: number;
            slug: string;
        };
    } & {
        id: number;
        userId: number;
        alertsTypeId: number;
        desktop: boolean;
        mobile: boolean;
        email: boolean;
        app: boolean;
        addedDate: Date;
        modifiedDate: Date;
    }>;
    unsubscribeAll(user: AuthenticatedUser): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
}
