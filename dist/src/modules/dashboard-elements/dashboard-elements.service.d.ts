import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateDashboardElementDto } from './dto/create-dashboard-element.dto';
import { UpdateDashboardElementDto } from './dto/update-dashboard-element.dto';
import { DashboardElementFilters } from './dto/dashboard-element-filters.dto';
import { AuthenticatedUser } from 'src/authentication/jwt-payload';
import { ProjectRole } from 'src/config/constants';
import { ProjectFiltersDto } from './dto/dashboard-project-filters.dto';
import { ReimbursementPermissionSetType } from '../reimbursement/reimbursement.permissions';
import { CashAdvancePermissionSetType } from '../cash-advance/cash-advance.permissions';
import { LeaveRequestPermissionSetType } from '../leave-request/leave-request.permissions';
export declare class DashboardElementsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createDto: CreateDashboardElementDto): Promise<{
        id: number;
        title: string;
        slug: string;
        isPublished: boolean;
        isDeleted: boolean;
    }>;
    findAll(filters: Prisma.DashboardElementWhereInput): Prisma.PrismaPromise<{
        id: number;
        title: string;
        slug: string;
        isPublished: boolean;
        isDeleted: boolean;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        title: string;
        slug: string;
        isPublished: boolean;
        isDeleted: boolean;
    }>;
    findBySlug(slug: string): Promise<{
        id: number;
        title: string;
        slug: string;
        isPublished: boolean;
        isDeleted: boolean;
    }>;
    update(id: number, updateDto: UpdateDashboardElementDto): Promise<{
        id: number;
        title: string;
        slug: string;
        isPublished: boolean;
        isDeleted: boolean;
    }>;
    remove(id: number): Promise<{
        id: number;
        title: string;
        slug: string;
        isPublished: boolean;
        isDeleted: boolean;
    }>;
    applyFilters(filters: DashboardElementFilters): Prisma.DashboardElementWhereInput;
    findDashboardElementsOfUser(user: AuthenticatedUser): Promise<({
        DashboardElement: {
            slug: string;
        };
    } & {
        roleId: number;
        dashboardElementId: number;
        order: number;
    })[]>;
    applyProjectFilters(filters: ProjectFiltersDto, user: AuthenticatedUser, hasGlobalPermission?: boolean): Prisma.ProjectWhereInput;
    findAllProjects(filters: Prisma.ProjectWhereInput, rawFilters?: ProjectFiltersDto): Prisma.PrismaPromise<{
        id: number;
        addedDate: Date;
        title: string;
        slug: string;
        startDate: Date;
        endDate: Date;
        comment: string;
        ProjectType: {
            title: string;
            slug: string;
        };
        priority: number;
        onHold: boolean;
        referenceNumber: string;
        ProjectState: {
            id: number;
            title: string;
            slug: string;
            bgColor: string;
            textColor: string;
        };
    }[]>;
    findActiveQuotation(): Prisma.PrismaPromise<number>;
    findActiveLeads(): Prisma.PrismaPromise<number>;
    findActiveEnquiry(user: AuthenticatedUser, readAll?: boolean): Prisma.PrismaPromise<number>;
    findActiveInvoices(): Prisma.PrismaPromise<number>;
    findActiveReimbursement(user: AuthenticatedUser, permissions: Partial<ReimbursementPermissionSetType>): Prisma.PrismaPromise<number>;
    findActiveCashAdvanceRequest(user: AuthenticatedUser, permissions: Partial<CashAdvancePermissionSetType>): Prisma.PrismaPromise<number>;
    findActiveLeaveRequest(user: AuthenticatedUser, permissions: Partial<LeaveRequestPermissionSetType>): Prisma.PrismaPromise<number>;
    findPendingProject_dashboard(user: AuthenticatedUser, memberType: keyof typeof ProjectRole): Prisma.PrismaPromise<number>;
    findPermitExpiring(): Prisma.PrismaPromise<number>;
    findGovernmentFeesToCollect(): Prisma.PrismaPromise<number>;
    findActiveEmployees(): Prisma.PrismaPromise<number>;
}
