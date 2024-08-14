import { BrandingThemeService } from './branding-theme.service';
import { CreateBrandingThemeDto } from './dto/create-branding-theme.dto';
import { UpdateBrandingThemeDto } from './dto/update-branding-theme.dto';
import { ParamsDto, ResponseError, ResponseSuccess } from 'src/common-types/common-types';
export declare class BrandingThemeController {
    private readonly brandingThemeService;
    constructor(brandingThemeService: BrandingThemeService);
    create(createDto: CreateBrandingThemeDto): Promise<ResponseSuccess | ResponseError>;
    findAll(): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateDto: UpdateBrandingThemeDto): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
