import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { FindBySlugDto, ParamsDto, ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { AccountFiltersDto } from './dto/account.filters.dto';
export declare class AccountController {
    private readonly accountService;
    constructor(accountService: AccountService);
    create(createDto: CreateAccountDto): Promise<ResponseSuccess | ResponseError>;
    findBySlug(findBySlugDto: FindBySlugDto): Promise<ResponseSuccess | ResponseError>;
    findAll(filters: AccountFiltersDto): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updateDto: UpdateAccountDto): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
