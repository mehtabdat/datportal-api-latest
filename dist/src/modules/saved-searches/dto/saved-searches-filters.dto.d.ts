import { SavedSearchesFiltersInput } from './create-saved-search.dto';
export declare class SavedSearchesFiltersDto {
    userIds?: number | number[];
    organizationId?: number;
    savedSearchesFilters?: SavedSearchesFiltersInput;
    isPublished?: boolean;
}
