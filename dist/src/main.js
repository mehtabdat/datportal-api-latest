"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const helpers_1 = require("./helpers/helpers");
const swagger_configuration_1 = require("./app-configuration/swagger-configuration");
const bodyParser = require("body-parser");
const basicAuth = require('express-basic-auth');
const whitelistDomains = [
    'localhost',
    'yallahproperty.ae',
    'admin.yallahproperty.ae',
    'api.yallahproperty.ae',
    'analytics.yallahproperty.ae',
    'sandbox.yallahproperty.ae',
    'sandbox.admin.yallahproperty.ae',
    'sandbox.api.yallahproperty.ae',
];
const whitelistIp = ["54.169.31.224", "172.31.23.152", "94.205.243.22", "2.51.154.3", "::11"];
const getDomainName = (fullUrl) => {
    let url = new URL(fullUrl);
    return url.hostname;
};
const corsOptionsDelegate = function (req, res, next) {
    if (process.env.ENVIRONMENT === "development") {
        return next();
    }
    let origin = (req.headers.origin) ? getDomainName(req.headers.origin) : "";
    let referer = (req.headers.referer) ? getDomainName(req.headers.referer) : "";
    if (whitelistDomains.includes(origin) || whitelistDomains.includes(referer)) {
        return next();
    }
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let allIp = [];
    if (!Array.isArray(ip)) {
        allIp = ip.split(',');
    }
    else {
        allIp = ip;
    }
    for (const __ip of allIp) {
        if (whitelistIp.indexOf(__ip.trim()) !== -1) {
            return next();
        }
    }
    return next();
};
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { logger: (0, helpers_1.loggerOptions)() });
    app.enableCors({
        exposedHeaders: ['Content-Disposition']
    });
    app.use('*', corsOptionsDelegate);
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: common_1.VERSION_NEUTRAL
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true, whitelist: true, exceptionFactory: (errors) => new common_1.BadRequestException(errors), }));
    if (process.env.ENVIRONMENT === "development") {
        app.use(['/api-documentation', '/api-documentation-json', '*/templates/*'], basicAuth({
            challenge: true,
            users: {
                [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
            },
        }));
        (0, swagger_configuration_1.initializeSwagger)(app);
    }
    app.enableShutdownHooks();
    app.use('/xero/webhook', bodyParser.raw({ type: 'application/json' }));
    app.setViewEngine('ejs');
    await app.listen(5569);
}
bootstrap();
//# sourceMappingURL=main.js.map