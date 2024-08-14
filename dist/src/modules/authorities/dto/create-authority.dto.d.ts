import { Prisma } from "@prisma/client";
export declare class CreateAuthorityDto implements Prisma.AuthoritiesCreateManyInput {
    title: string;
    slug: string;
}
