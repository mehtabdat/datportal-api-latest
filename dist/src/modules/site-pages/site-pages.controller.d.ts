import { SitePagesService } from './site-pages.service';
import { CreateSitePageDto } from './dto/create-site-page.dto';
import { UpdateSitePageDto } from './dto/update-site-page.dto';
import { ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { DataBySlugDto, ParamsDto, RemoveMultipleRelationDto, RemoveRelationDto } from './dto/params.dto';
import { SitePagesFiltersDto } from './dto/site-pages-filters.dto';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
export declare class SitePagesController {
    private readonly sitePagesService;
    constructor(sitePagesService: SitePagesService);
    create(createSitePageDto: CreateSitePageDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findAll(filters: SitePagesFiltersDto): Promise<ResponseSuccess | ResponseError>;
    findPageContent(params: DataBySlugDto, req: any): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateSitePageDto: UpdateSitePageDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    removeSectionFromPage(params: RemoveRelationDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    removeMultipleSectionFromPage(removeRelationDto: RemoveMultipleRelationDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
}
