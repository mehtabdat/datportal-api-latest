import { ProjectFiltersDto } from 'src/modules/project/dto/project-filters.dto';
export declare class SavedSearchesAdminFiltersDto {
    userIds?: number | number[];
    organizationId?: number;
    savedSearchesFilters?: ProjectFiltersDto;
    isPublished?: boolean;
}
