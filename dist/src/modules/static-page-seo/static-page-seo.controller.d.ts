/// <reference types="multer" />
import { ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { StaticPageSeoService } from './static-page-seo.service';
import { CreateStaticPageSeoDto } from './dto/create-static-page-seo.dto';
import { UpdateStaticPageSeoDto } from './dto/update-static-page-seo.dto';
import { FindItemBySlug, ParamsDto } from './dto/params.dto';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
import { StaticPageSEOPaginationDto } from './dto/static-page-seo.pagination.dto';
import { StaticPageSEOFiltersDto } from './dto/static-page-seo-filters.dto';
export declare class StaticPageSeoController {
    private readonly staticPageSeoService;
    constructor(staticPageSeoService: StaticPageSeoService);
    create(createStaticPageSeoDto: CreateStaticPageSeoDto, image: Express.Multer.File, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findAll(req: AuthenticatedRequest, staticPageSEOFiltersDto: StaticPageSEOFiltersDto, pagination: StaticPageSEOPaginationDto): Promise<ResponseSuccess | ResponseError>;
    findPublished(req: AuthenticatedRequest, pagination: StaticPageSEOPaginationDto): Promise<ResponseSuccess | ResponseError>;
    makeDefault(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateStaticPageSeoDto: UpdateStaticPageSeoDto, image: Express.Multer.File, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findOneByPageSlug(params: FindItemBySlug, req: any): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
