"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSwagger = void 0;
const swagger_1 = require("@nestjs/swagger");
const swaggerOptions = {
    swaggerOptions: {
        authAction: {
            defaultBearerAuth: {
                name: 'defaultBearerAuth',
                schema: {
                    description: 'Default',
                    type: 'http',
                    in: 'header',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
                value: 'thisIsASampleBearerAuthToken123',
            },
        },
        displayRequestDuration: true
    },
};
function initializeSwagger(app) {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('DAT Projects API')
        .setExternalDoc("Download API in JSON format", '/api-documentation-json')
        .setVersion('v1.1')
        .setDescription('The documentation will describe all endpoints used in the system along with the expected parameters, authentication tokens')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .addSecurityRequirements('JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    Object.values(document.paths).forEach((path) => {
        Object.values(path).forEach((method) => {
            if (Array.isArray(method.security) && method.security.includes('public')) {
                method.security = [];
            }
        });
    });
    swagger_1.SwaggerModule.setup('api-documentation', app, document, {
        swaggerOptions: {
            displayRequestDuration: true,
            persistAuthorization: true,
        },
    });
}
exports.initializeSwagger = initializeSwagger;
//# sourceMappingURL=swagger-configuration.js.map