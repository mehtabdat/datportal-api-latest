/// <reference types="multer" />
import { BiometricsJobService } from './biometrics-job.service';
import { CreateBiometricsJobDto } from './dto/create-biometrics-job.dto';
import { UpdateBiometricsJobDto } from './dto/update-biometrics-job.dto';
import { Pagination, ParamsDto, ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { BiometricsJobFilters } from './dto/biometrics-job-filters.dto';
import { BiometricsJobRollbackDto } from './dto/biometrics-job-rollback.dto';
export declare class BiometricsJobController {
    private readonly biometricsJobService;
    constructor(biometricsJobService: BiometricsJobService);
    create(createDto: CreateBiometricsJobDto, file: Express.Multer.File): Promise<ResponseSuccess | ResponseError>;
    findAll(filters: BiometricsJobFilters, pagination: Pagination): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    process(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    stop(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    rollback(params: ParamsDto, updateDto: BiometricsJobRollbackDto): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateDto: UpdateBiometricsJobDto): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
