import { Client, Invoice, Project, Quotation } from "@prisma/client";
import { PrismaService } from "src/prisma.service";
import { XeroAccountingService } from "../xero-accounting.service";
export declare class XeroProcessorService {
    private readonly prisma;
    private readonly xeroAccountingService;
    private readonly logger;
    constructor(prisma: PrismaService, xeroAccountingService: XeroAccountingService);
    syncClient(client: Client, xeroTenantId: string): Promise<void>;
    syncInvoice(invoice: Invoice): Promise<void>;
    syncQuotation(quotation: Quotation): Promise<void>;
    updateQuotationStatus(quotation: Quotation): Promise<void>;
    updateInvoiceStatus(invoice: Invoice): Promise<void>;
    syncProject(project: Project): Promise<void>;
}
