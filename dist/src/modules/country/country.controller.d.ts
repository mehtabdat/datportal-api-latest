import { ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { ParamsDto } from './dto/params-dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
export declare class CountryController {
    private readonly countryService;
    constructor(countryService: CountryService);
    create(createCountryDto: CreateCountryDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findAll(req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findAllAvailableCountry(): Promise<ResponseSuccess | ResponseError>;
    findAvailableCountry(): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateCountryDto: UpdateCountryDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
