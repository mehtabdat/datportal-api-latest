import { Country } from "../entities/country.entity";
import { ResponseSuccess } from "src/common-types/common-types";
export declare const countryFileUploadPath = "/public/country/";
export declare class CountryResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Country;
}
export declare class CountryResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Country;
}
