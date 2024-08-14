import { ResponseSuccess } from "src/common-types/common-types";
import { Diary } from "../entities/diary.entity";
export declare class DiaryResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Diary;
}
export declare class DiaryResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Diary;
}
