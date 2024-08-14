import { Prisma, SavedSearchesVisibility } from "@prisma/client";
import { SavedSearchesFilterTypes } from "../types/saved-searches.types";
export declare class SavedSearchesFiltersInput implements SavedSearchesFilterTypes {
    category?: string;
    type?: string;
}
export declare class CreateSavedSearchDto implements Prisma.SavedSearchesCreateInput {
    title: string;
    icon?: string;
    visibility?: SavedSearchesVisibility;
    savedSearchesFilters?: SavedSearchesFiltersInput;
}
