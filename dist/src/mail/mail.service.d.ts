import { MailerService } from '@nestjs-modules/mailer';
import { Client, FileManagement, Invoice, Leads, Organization, Prisma, Project, Quotation, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { MailLogsFiltersDto } from './dto/mail-logs-filters.dto';
import { MailLogsPaginationDto } from './dto/mail-logs-pagination.dto';
import { MailLogsSortingDto } from './dto/mail-logs-sorting.dto';
import { SendPasswordResetLink } from './types/send-password-reset-link';
import { AuthenticatedUser } from 'src/authentication/jwt-payload';
export declare class MailService {
    private mailerService;
    private prisma;
    private readonly logger;
    constructor(mailerService: MailerService, prisma: PrismaService);
    resolveOrigin(origin: string): string;
    sendUserPasswordResetLink(emailData: SendPasswordResetLink): Promise<void>;
    sendOtpEmail(user: Partial<User>, otpCode: number): Promise<void>;
    logSentEmail(data: Prisma.MailSentLogsCreateInput): Promise<void>;
    findMailSentLogs(pagination: MailLogsPaginationDto, sorting: MailLogsSortingDto, condition: Prisma.MailSentLogsWhereInput): Prisma.PrismaPromise<{
        id: number;
        subject: string;
        calleFunction: string;
        email: string;
        data: Prisma.JsonValue;
        template: string;
        addedDate: Date;
    }[]>;
    applyFilters(filters: MailLogsFiltersDto): Prisma.MailSentLogsWhereInput;
    countTotalRecord(condition: Prisma.MailSentLogsWhereInput): Prisma.PrismaPromise<number>;
    sendLeadsEnquiryEmail(user: Partial<User>, leads: Leads & {
        property: {
            slug: string;
        };
    }, link: string): Promise<void>;
    sendQuotationToClient(quotation: Quotation & {
        Lead: Partial<Leads> & {
            Client: Partial<Client>;
        } & {
            SubmissionBy: Partial<Organization>;
        };
    }, user: AuthenticatedUser): Promise<void>;
    sendInvoiceToClient(invoice: Invoice & {
        Project: Partial<Project> & {
            SubmissionBy: Partial<Organization>;
        };
    } & {
        Client: Partial<Client>;
    }, user: AuthenticatedUser): Promise<void>;
    sendQuotationNotification(quotation: Quotation & {
        Lead: Partial<Leads> & {
            Client: Partial<Client>;
        };
    }, userEmails: string | string[]): Promise<void>;
    sendMilestoneCompletedNotification(project: Partial<Project>, completedBy: Partial<User>, userEmails: string | string[]): Promise<void>;
    sendEnquiryConfirmedNotification(lead: Partial<Leads>, client: Partial<Client>, confirmedBy: Partial<User>, userEmails: string | string[]): Promise<void>;
    sendQuotationFollowupNotification(userEmails: string | string[], quotationCount: number, salutation?: string): Promise<void>;
    sendNewProjectNotification(project: Partial<Project>, client: Partial<Client>, submissionBy: Partial<Organization>, userEmails: string | string[]): Promise<void>;
    sendProjectResumedNotification(project: Partial<Project>, client: Partial<Client>, submissionBy: Partial<Organization>, userEmails: string | string[]): Promise<void>;
    sendProjectHoldNotification(project: Partial<Project>, client: Partial<Client>, submissionBy: Partial<Organization>, userEmails: string | string[]): Promise<void>;
    sendProjectMemberNotification(project: Partial<Project>, projectRole: string, client: Partial<Client>, submissionBy: Partial<Organization>, user: Partial<User>): Promise<void>;
    shareProjectFilesToClient(project: Partial<Project> & {
        Client: Partial<Client>;
        ProjectClient: Partial<Client>[];
    }, files: Array<FileManagement>, user: AuthenticatedUser): Promise<void>;
}
