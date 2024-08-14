import { ResponseSuccess } from "src/common-types/common-types";
import { Blog } from "../entities/blog.entity";
export declare class BlogsResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Blog;
}
export declare class BlogsResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Blog;
}
export declare const blogsFileUploadPath = "public/blogs";
