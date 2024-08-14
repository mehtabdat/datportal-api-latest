/// <reference types="multer" />
import { SitePagesContentService } from './site-pages-content.service';
import { CreateSitePagesContentDto } from './dto/create-site-pages-content.dto';
import { UpdateSitePagesContentDto } from './dto/update-site-pages-content.dto';
import { ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { ParamsDto } from './dto/params.dto';
export declare class SitePagesContentController {
    private readonly sitePagesContentService;
    constructor(sitePagesContentService: SitePagesContentService);
    create(createSitePagesContentDto: CreateSitePagesContentDto, image: Express.Multer.File): Promise<ResponseSuccess | ResponseError>;
    findAll(): Promise<ResponseSuccess | ResponseError>;
    findAllByPageSection(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateSitePagesContentDto: UpdateSitePagesContentDto, image: Express.Multer.File): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
