import { CompanyAssetService } from './company-asset.service';
import { CreateCompanyAssetDto } from './dto/create-company-asset.dto';
import { UpdateCompanyAssetDto } from './dto/update-company-asset.dto';
import { Pagination, ParamsDto, ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { CompanyAssetFiltersDto } from './dto/company-asset-filters.dto';
import { AllocateAssetToUserDto } from './dto/allocate-asset-to-user.dto';
export declare class CompanyAssetController {
    private readonly companyAssetService;
    constructor(companyAssetService: CompanyAssetService);
    create(createDto: CreateCompanyAssetDto): Promise<ResponseSuccess | ResponseError>;
    allocateResource(createDto: AllocateAssetToUserDto): Promise<ResponseSuccess | ResponseError>;
    findPublished(filters: CompanyAssetFiltersDto, pagination: Pagination): Promise<ResponseSuccess | ResponseError>;
    findCars(): Promise<ResponseSuccess | ResponseError>;
    findAll(filters: CompanyAssetFiltersDto, pagination: Pagination): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateDto: UpdateCompanyAssetDto): Promise<ResponseSuccess | ResponseError>;
    revoke(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
