import { SitePagesSectionService } from './site-pages-section.service';
import { CreateSitePagesSectionDto } from './dto/create-site-pages-section.dto';
import { UpdateSitePagesSectionDto } from './dto/update-site-pages-section.dto';
import { ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { ParamsDto } from './dto/params.dto';
import { SitePagesSectionFiltersDto } from './dto/site-pages-section-filters.dto';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
export declare class SitePagesSectionController {
    private readonly sitePagesSectionService;
    constructor(sitePagesSectionService: SitePagesSectionService);
    create(createSitePagesSectionDto: CreateSitePagesSectionDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findAll(filters: SitePagesSectionFiltersDto): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    allowMultiples(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    disallowMultiples(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateSitePagesSectionDto: UpdateSitePagesSectionDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
}
