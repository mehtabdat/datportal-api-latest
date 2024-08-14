import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Pagination, ParamsDto, ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { ClientFiltersDto } from './dto/client-filters.dto';
export declare class ClientController {
    private readonly clientService;
    constructor(clientService: ClientService);
    create(createDto: CreateClientDto): Promise<ResponseSuccess | ResponseError>;
    findPublished(filters: ClientFiltersDto, pagination: Pagination): Promise<ResponseSuccess | ResponseError>;
    findAll(filters: ClientFiltersDto, pagination: Pagination): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateDto: UpdateClientDto): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
