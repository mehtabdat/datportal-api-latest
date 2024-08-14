/// <reference types="multer" />
import { CreateCarReservationRequestDto } from './dto/create-car-reservation.dto';
import { Pagination, ParamsDto, ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { CarReservationRequestFiltersDto } from './dto/car-reservation-request-filters.dto';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
import { CarReservationRequestAdminAction } from './dto/car-reservation-request-admin-action.dto';
import { CarReservationAuthorizationService } from './car-reservation-request.authorization.service';
import { CarReservationRequestService } from './car-reservation-request.service';
import { CheckCarAvailabilityDto } from './dto/check-car-availability.dto';
export declare class CarReservationRequestController {
    private readonly carReservationRequestService;
    private readonly carReservationRequestAuthorizationService;
    constructor(carReservationRequestService: CarReservationRequestService, carReservationRequestAuthorizationService: CarReservationAuthorizationService);
    create(createDto: CreateCarReservationRequestDto, files: Array<Express.Multer.File>, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findAll(filters: CarReservationRequestFiltersDto, req: AuthenticatedRequest, pagination: Pagination): Promise<ResponseSuccess | ResponseError>;
    readOwnRequest(filters: CarReservationRequestFiltersDto, req: AuthenticatedRequest, pagination: Pagination): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    withdraw(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    submitRequest(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    hrAction(params: ParamsDto, CarReservationRequestAdminAction: CarReservationRequestAdminAction, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    checkAvailability(checkCarAvailabilityDto: CheckCarAvailabilityDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
}
