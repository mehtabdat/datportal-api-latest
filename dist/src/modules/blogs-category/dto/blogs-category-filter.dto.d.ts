import { BlogsCategory } from '@prisma/client';
export declare class BlogsCategoryFiltersDto implements Partial<BlogsCategory> {
    title?: string;
    status?: number;
    countryIds?: number | number[];
}
export declare class BlogsCategoryPublicFiltersDto {
    title?: string;
}
