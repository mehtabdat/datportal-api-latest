import { BulkUploadFormatService } from './bulk-upload-format.service';
import { CreateBulkUploadFormatDto } from './dto/create-bulk-upload-format.dto';
import { UpdateBulkUploadFormatDto } from './dto/update-bulk-upload-format.dto';
import { ParamsDto, ResponseError, ResponseSuccess } from 'src/common-types/common-types';
export declare class BulkUploadFormatController {
    private readonly BulkUploadFormatService;
    constructor(BulkUploadFormatService: BulkUploadFormatService);
    create(createBulkUploadFormatDto: CreateBulkUploadFormatDto): Promise<ResponseSuccess | ResponseError>;
    findAll(): Promise<ResponseSuccess | ResponseError>;
    findAllPublished(): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateBulkUploadFormatDto: UpdateBulkUploadFormatDto): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
