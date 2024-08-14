import { ResponseSuccess } from "src/common-types/common-types";
import { Product } from "../entities/product.entity";
export declare class ProductResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Product;
}
export declare class ProductResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Product;
}
