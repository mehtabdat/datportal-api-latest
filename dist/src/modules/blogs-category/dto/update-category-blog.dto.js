"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBlogCategoryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_category_blog_dto_1 = require("./create-category-blog.dto");
class UpdateBlogCategoryDto extends (0, swagger_1.PartialType)(create_category_blog_dto_1.CreateBlogCategoryDto) {
}
exports.UpdateBlogCategoryDto = UpdateBlogCategoryDto;
//# sourceMappingURL=update-category-blog.dto.js.map