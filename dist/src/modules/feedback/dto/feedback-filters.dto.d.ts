import { Feedback } from "@prisma/client";
import { FeedbackRatingRange, FeedbackType } from "src/config/constants";
import { TypeFromEnumValues } from "src/helpers/common";
export declare class FeedbackFiltersDto implements Partial<Feedback> {
    type: TypeFromEnumValues<typeof FeedbackType>;
    url: string;
    rating?: TypeFromEnumValues<typeof FeedbackRatingRange>;
    addedById: number;
}
