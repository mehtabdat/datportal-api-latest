import { Prisma } from "@prisma/client";
import { FeedbackRatingRange } from "src/config/constants";
import { TypeFromEnumValues } from "src/helpers/common";
export declare class CreateFeedbackDto implements Prisma.FeedbackUncheckedCreateInput {
    rating?: TypeFromEnumValues<typeof FeedbackRatingRange>;
    comment?: string;
    files?: string;
    addedById: number;
}
