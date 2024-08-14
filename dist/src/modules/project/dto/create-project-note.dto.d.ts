import { Prisma } from "@prisma/client";
export declare class CreateProjectNoteDto implements Prisma.ProjectConversationUncheckedCreateInput {
    message: string;
    projectId: number;
}
