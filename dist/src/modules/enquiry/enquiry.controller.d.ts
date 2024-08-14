/// <reference types="multer" />
import { EnquiryService } from './enquiry.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import { Pagination, ParamsDto, ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
import { EnquiryFiltersDto } from './dto/enquiry-filters.dto';
import { EnquiryStatusDto } from './dto/enquiry-status.dto';
import { SystemLogger } from '../system-logs/system-logger.service';
import { CreateEnquiryNoteDto } from './dto/create-enquiry-note.dto';
import { AssignEnquiryDto } from './dto/assign-enquiry.dto';
import { EnquiryAuthorizationService } from './enquiry.authorization.service';
import { AutoCreateLeadFromEnquiryDto } from './dto/auto-create-lead-from-enquiry.dto';
import { UploadEnquiryDocuments } from './dto/upload-files.dto';
export declare class EnquiryController {
    private readonly enquiryService;
    private authorizationService;
    private readonly systemLogger;
    private readonly logger;
    constructor(enquiryService: EnquiryService, authorizationService: EnquiryAuthorizationService, systemLogger: SystemLogger);
    uploadPropertyDocuments(enquiryDocuments: UploadEnquiryDocuments, files: Array<Express.Multer.File>, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    create(createLeadDto: CreateEnquiryDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    createEnquiry(createLeadDto: CreateEnquiryDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    autoCreateUsingEnquiry(createLeadDto: AutoCreateLeadFromEnquiryDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findAll(pagination: Pagination, filters: EnquiryFiltersDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findCounts(req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findDuplicateClient(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateEnquiryDto: UpdateEnquiryDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    markConcernAsResolved(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    updateStatus(params: ParamsDto, req: AuthenticatedRequest, EnquiryStatusDto: EnquiryStatusDto): Promise<ResponseSuccess | ResponseError>;
    findLogs(params: ParamsDto, req: AuthenticatedRequest, pagination: Pagination): Promise<ResponseSuccess | ResponseError>;
    findNotes(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    addNote(params: ParamsDto, req: AuthenticatedRequest, createNote: CreateEnquiryNoteDto): Promise<ResponseSuccess | ResponseError>;
    removeNote(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    removeDocument(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    assignEnquiry(params: ParamsDto, assignEnquiryDto: AssignEnquiryDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    removeEnquiry(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
}
