import { Feedback as __Feedback } from "@prisma/client";
export declare class Feedback implements Partial<__Feedback> {
    id: number;
    type: number;
    url: string;
    rating: number;
    comment: string;
    addedById: number;
    addedDate: Date;
}
