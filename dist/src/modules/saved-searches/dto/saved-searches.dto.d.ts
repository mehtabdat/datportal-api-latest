import { ResponseSuccess } from "src/common-types/common-types";
import { SavedSearch } from "../entities/saved-search.entity";
export declare class SavedSearchesResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: SavedSearch;
}
export declare class SavedSearchesResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: SavedSearch;
}
