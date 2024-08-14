import { Prisma } from '@prisma/client';
import { AuthenticatedUser } from 'src/authentication/jwt-payload';
import { PrismaService } from 'src/prisma.service';
import { CreateAlertsTypeDto } from './dto/create-alerts-type.dto';
import { UpdateAlertsTypeDto } from './dto/update-alerts-type.dto';
export declare class AlertsTypeService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createAlertsTypeDto: CreateAlertsTypeDto): Promise<{
        id: number;
        slug: string;
        title: string;
        description: string;
        forAdminpanel: boolean;
        isPublished: boolean;
        isDeleted: boolean;
        addedDate: Date;
    }>;
    findAll(): Prisma.PrismaPromise<{
        id: number;
        slug: string;
        title: string;
        description: string;
        forAdminpanel: boolean;
        isPublished: boolean;
        isDeleted: boolean;
        addedDate: Date;
    }[]>;
    findAllPublished(user: AuthenticatedUser): Prisma.PrismaPromise<({
        UserAlertsSetting: {
            id: number;
            userId: number;
            alertsTypeId: number;
            desktop: boolean;
            mobile: boolean;
            email: boolean;
            app: boolean;
            addedDate: Date;
            modifiedDate: Date;
        }[];
    } & {
        id: number;
        slug: string;
        title: string;
        description: string;
        forAdminpanel: boolean;
        isPublished: boolean;
        isDeleted: boolean;
        addedDate: Date;
    })[]>;
    findOne(id: number): Promise<{
        id: number;
        slug: string;
        title: string;
        description: string;
        forAdminpanel: boolean;
        isPublished: boolean;
        isDeleted: boolean;
        addedDate: Date;
    }>;
    findBySlug(slug: string, user: AuthenticatedUser): Promise<{
        UserAlertsSetting: {
            id: number;
            userId: number;
            alertsTypeId: number;
            desktop: boolean;
            mobile: boolean;
            email: boolean;
            app: boolean;
            addedDate: Date;
            modifiedDate: Date;
        }[];
    } & {
        id: number;
        slug: string;
        title: string;
        description: string;
        forAdminpanel: boolean;
        isPublished: boolean;
        isDeleted: boolean;
        addedDate: Date;
    }>;
    update(id: number, updateAlertsTypeDto: UpdateAlertsTypeDto): Promise<{
        id: number;
        slug: string;
        title: string;
        description: string;
        forAdminpanel: boolean;
        isPublished: boolean;
        isDeleted: boolean;
        addedDate: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        slug: string;
        title: string;
        description: string;
        forAdminpanel: boolean;
        isPublished: boolean;
        isDeleted: boolean;
        addedDate: Date;
    }>;
}
