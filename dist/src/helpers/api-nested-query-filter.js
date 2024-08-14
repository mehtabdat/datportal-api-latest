"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiNestedQuery = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
function ApiNestedQuery(query) {
    const constructor = query.prototype;
    const properties = Reflect
        .getMetadata('swagger/apiModelPropertiesArray', constructor)
        .map(prop => prop.substr(1));
    const decorators = properties.map(property => {
        const propertyType = Reflect.getMetadata('design:type', constructor, property);
        return [
            (0, swagger_1.ApiExtraModels)(propertyType),
            (0, swagger_1.ApiQuery)({
                required: false,
                name: property,
                style: 'deepObject',
                explode: true,
                type: 'object',
                schema: {
                    $ref: (0, swagger_1.getSchemaPath)(propertyType),
                },
            })
        ];
    }).flat();
    return (0, common_1.applyDecorators)(...decorators);
}
exports.ApiNestedQuery = ApiNestedQuery;
//# sourceMappingURL=api-nested-query-filter.js.map