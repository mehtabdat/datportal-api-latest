import { SavedSearchesService } from './saved-searches.service';
import { CreateSavedSearchDto } from './dto/create-saved-search.dto';
import { ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { ParamsDto } from './dto/params.dto';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
import { SavedSearchesFiltersDto } from './dto/saved-searches-filters.dto';
import { SavedSearchesPaginationDto } from './dto/saved-searches-pagination.dto';
import { SavedSearchesSortingDto } from './dto/saved-searches-sorting.dto';
import { AuthorizationService } from 'src/authorization/authorization.service';
import { CreateAdminSavedSearchDto } from './dto/create-saved-search-admin.dto';
import { SavedSearchesAdminFiltersDto } from './dto/saved-searches-admin-filters.dto';
export declare class SavedSearchesController {
    private readonly savedSearchesService;
    private readonly authorizationService;
    constructor(savedSearchesService: SavedSearchesService, authorizationService: AuthorizationService);
    create(createAlertDto: CreateSavedSearchDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    createFilters(createAlertDto: CreateAdminSavedSearchDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findAllAdminpanel(req: AuthenticatedRequest, filters: SavedSearchesAdminFiltersDto, pagination: SavedSearchesPaginationDto, sorting: SavedSearchesSortingDto): Promise<ResponseSuccess | ResponseError>;
    findAll(req: AuthenticatedRequest, filters: SavedSearchesFiltersDto, pagination: SavedSearchesPaginationDto, sorting: SavedSearchesSortingDto): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    removeAll(req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    removeAllAdminpanelFilters(req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
}
