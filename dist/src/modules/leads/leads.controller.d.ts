/// <reference types="multer" />
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { ParamsDto } from './dto/params.dto';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
import { LeadsPaginationDto } from './dto/lead-pagination.dto';
import { LeadsSortingDto } from './dto/lead-sorting.dto';
import { LeadsFiltersDto } from './dto/lead-filters.dto';
import { LeadsStatusDto } from './dto/lead-status.dto';
import { SystemLogger } from '../system-logs/system-logger.service';
import { AssignLeadsDto } from './dto/assign-leads.dto';
import { CreateLeadNoteDto } from './dto/create-load-note.dto';
import { LeadsAuthorizationService } from './leads.authorization.service';
import { UploadLeadDocuments } from './dto/upload-files.dto';
export declare class LeadsController {
    private readonly leadsService;
    private authorizationService;
    private readonly systemLogger;
    private readonly logger;
    constructor(leadsService: LeadsService, authorizationService: LeadsAuthorizationService, systemLogger: SystemLogger);
    uploadPropertyDocuments(uploadDocuments: UploadLeadDocuments, files: Array<Express.Multer.File>, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    create(createLeadDto: CreateLeadDto): Promise<ResponseSuccess | ResponseError>;
    findAll(pagination: LeadsPaginationDto, sorting: LeadsSortingDto, filters: LeadsFiltersDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findCounts(req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    updateStatus(params: ParamsDto, req: AuthenticatedRequest, leadsStatusDto: LeadsStatusDto): Promise<ResponseSuccess | ResponseError>;
    assignLead(params: ParamsDto, assignLeadsDto: AssignLeadsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    addNote(params: ParamsDto, req: AuthenticatedRequest, createLeadNoteDto: CreateLeadNoteDto): Promise<ResponseSuccess | ResponseError>;
    removeNote(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    removeDocument(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findNotes(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    markConcernAsResolved(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    removeEnquiry(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateLeadDto: UpdateLeadDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
}
