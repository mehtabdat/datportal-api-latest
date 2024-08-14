import { ResponseSuccess } from "src/common-types/common-types";
import { BlogCategory } from "../entities/blog-category.entity";
export declare class BlogsCategoryResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: BlogCategory;
}
export declare class BlogsCategoryResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: BlogCategory;
}
export declare const blogsFileUploadPath = "public/blogs-category";
