import { TokenService } from 'src/authentication/token.service';
import { AuthorizationService } from 'src/authorization/authorization.service';
import { ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { JwtToken } from './dto/jwt-token.dto';
import { ResourcesService } from './resources.service';
import { SitemapDto } from './dto/sitemap.dto';
export declare class ResourcesController {
    private readonly resourcesService;
    private readonly authorizationService;
    private readonly tokenService;
    constructor(resourcesService: ResourcesService, authorizationService: AuthorizationService, tokenService: TokenService);
    fetchResources(res: any, params: any, jwtToken: JwtToken, req: any): Promise<any>;
    fetchProjectResources(res: any, params: any, jwtToken: JwtToken, req: any): Promise<void>;
    fetchTaskResources(res: any, params: any, jwtToken: JwtToken, req: any): Promise<void>;
    fetchOrganizationResources(res: any, params: any, jwtToken: JwtToken, req: any): Promise<void>;
    readSitemapFile(): Promise<ResponseSuccess | ResponseError>;
    updateSitemapFile(sitemapDto: SitemapDto): Promise<ResponseSuccess | ResponseError>;
}
