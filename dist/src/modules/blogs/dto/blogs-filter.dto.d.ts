import { Blogs } from '@prisma/client';
export declare class BlogsFiltersDto implements Partial<Blogs> {
    title?: string;
    status?: number;
    category?: number;
    countryIds?: number | number[];
}
export declare class BlogsPublicFiltersDto {
    excludeId?: number;
    title?: string;
    category?: number;
    blogCategorySlug?: string;
    blogCategoryId?: number;
}
