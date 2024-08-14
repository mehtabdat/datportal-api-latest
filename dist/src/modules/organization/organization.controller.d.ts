/// <reference types="multer" />
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { FindOrgByUUID, ParamsDto } from './dto/params.dto';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
import { OrganizationPaginationDto } from './dto/organization-pagination.dto';
import { OrganizationSortingDto } from './dto/organization-sorting.dto';
import { OrganizationFiltersDto } from './dto/organization-filters.dto';
import { AuthorizationService } from 'src/authorization/authorization.service';
import { MailService } from 'src/mail/mail.service';
import { SuspendOrganizationDto } from './dto/suspend-organization.dto';
import { OrganizationMetaDataDto } from './dto/organization-meta.dto';
export declare class OrganizationController {
    private readonly organizationService;
    private authorizationService;
    private mailService;
    constructor(organizationService: OrganizationService, authorizationService: AuthorizationService, mailService: MailService);
    create(createOrganizationDto: CreateOrganizationDto, files: {
        logo?: Express.Multer.File[];
        digitalStamp?: Express.Multer.File[];
    }, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findAll(pagination: OrganizationPaginationDto, sorting: OrganizationSortingDto, filters: OrganizationFiltersDto, fetchMeta: OrganizationMetaDataDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findAllPublished(pagination: OrganizationPaginationDto, sorting: OrganizationSortingDto, filters: OrganizationFiltersDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findOneByUUID(params: FindOrgByUUID): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateOrganizationDto: UpdateOrganizationDto, files: {
        logo?: Express.Multer.File[];
        digitalStamp?: Express.Multer.File[];
    }, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    suspendOrganization(req: AuthenticatedRequest, params: ParamsDto, suspendOrganizationDto: SuspendOrganizationDto): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
