import { PrismaService } from "src/prisma.service";
import { AttendanceService } from "../attendance.service";
export declare class AttendanceProcessorService {
    private prisma;
    private readonly attendanceService;
    private readonly logger;
    constructor(prisma: PrismaService, attendanceService: AttendanceService);
    bulkProcessAttendance(beforeDate: Date): Promise<void>;
    userAttendanceOfGivenDate(userId: number, dayStart: Date, dayEnd: Date): Promise<void>;
}
