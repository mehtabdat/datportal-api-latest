import { Job } from 'bull';
import { XeroProcessorService } from './xero-accounting.processor.service';
import { PrismaService } from 'src/prisma.service';
import { Client, Invoice, Project, Quotation } from '@prisma/client';
export declare class XeroProcessor {
    private readonly xeroProcessorService;
    private readonly prisma;
    private readonly logger;
    constructor(xeroProcessorService: XeroProcessorService, prisma: PrismaService);
    syncClient(job: Job<{
        data: Client & {
            xeroTenantId: string;
        };
    }>): Promise<void>;
    syncInvoice(job: Job<{
        data: Invoice;
    }>): Promise<void>;
    syncQuotation(job: Job<{
        data: Quotation;
    }>): Promise<void>;
    updateQuotationStatus(job: Job<{
        data: Quotation;
    }>): Promise<void>;
    updateInvoiceStatus(job: Job<{
        data: Invoice;
    }>): Promise<void>;
    syncProject(job: Job<{
        data: Project;
    }>): Promise<void>;
    globalHandler(job: Job): void;
}
