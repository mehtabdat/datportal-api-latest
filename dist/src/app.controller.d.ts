import { Request } from "express";
import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(req: Request): string;
    getTest(req: Request): string;
    postHello(req: Request): string;
}
