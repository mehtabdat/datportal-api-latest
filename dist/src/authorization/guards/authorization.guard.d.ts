import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AuthorizationService } from '../authorization.service';
export declare class AuthorizationGuard implements CanActivate {
    private reflector;
    private authorizationService;
    constructor(reflector: Reflector, authorizationService: AuthorizationService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}
