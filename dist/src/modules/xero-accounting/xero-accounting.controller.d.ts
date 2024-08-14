import { RawBodyRequest } from '@nestjs/common';
import { XeroAccountingService } from './xero-accounting.service';
import { ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
import { Request } from "express";
import { XeroQuoteFiltersDto } from './dto/xero-quote-filters.dto';
export declare class XeroAccountingController {
    private readonly xeroAccountingService;
    constructor(xeroAccountingService: XeroAccountingService);
    findAll(req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    authenticate(req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    logout(): Promise<ResponseSuccess | ResponseError>;
    checkLoginStatus(): Promise<ResponseSuccess | ResponseError>;
    getQuotes(req: AuthenticatedRequest, xeroQuoteFiltersDto: XeroQuoteFiltersDto): Promise<ResponseSuccess | ResponseError>;
    syncAccounts(): Promise<ResponseSuccess | ResponseError>;
    syncProducts(): Promise<ResponseSuccess | ResponseError>;
    syncTaxRates(): Promise<ResponseSuccess | ResponseError>;
    getBrandingThemes(req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    getTenants(): Promise<ResponseSuccess | ResponseError>;
    webhooks(req: RawBodyRequest<Request>, signature: string): Promise<boolean>;
}
