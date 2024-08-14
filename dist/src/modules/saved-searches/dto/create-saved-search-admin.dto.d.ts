import { Prisma, SavedSearchesVisibility } from "@prisma/client";
import { ProjectFiltersDto } from "src/modules/project/dto/project-filters.dto";
export declare class CreateAdminSavedSearchDto implements Prisma.SavedSearchesCreateInput {
    title: string;
    icon?: string;
    visibility?: SavedSearchesVisibility;
    savedSearchesFilters?: ProjectFiltersDto;
}
