/// <reference types="multer" />
import { BiometricsService } from './biometrics.service';
import { CreateBiometricDto } from './dto/create-biometric.dto';
import { UpdateBiometricDto } from './dto/update-biometric.dto';
import { Pagination, ParamsDto, ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { BiometricsFilters } from './dto/biometrics-filters.dto';
import { BiometricsAuthorizationService } from './biometrics.authorization.service';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
import { CheckInCheckOutBiometricDto } from './dto/checkin-checkout-biometric.dto';
export declare class BiometricsController {
    private readonly biometricsService;
    private readonly authorizationService;
    constructor(biometricsService: BiometricsService, authorizationService: BiometricsAuthorizationService);
    createData(req: any): Promise<ResponseSuccess | ResponseError>;
    createDataTest(req: any): Promise<ResponseSuccess | ResponseError>;
    create(createDto: CreateBiometricDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    checkInCheckout(createDto: CheckInCheckOutBiometricDto, selfie: Express.Multer.File, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    getTodayCheckInCheckOut(req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findAll(filters: BiometricsFilters, req: AuthenticatedRequest, pagination: Pagination): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateDto: UpdateBiometricDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    delete(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
