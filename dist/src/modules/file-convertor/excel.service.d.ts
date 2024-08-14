import { AttendanceReportSheetDto } from './dto/attendance-report-sheet.dto';
import { PayrollReportSheetDto } from './dto/payroll-report-sheet.dto';
export declare class ExcelService {
    attendanceExcelReport(sheets: AttendanceReportSheetDto[], fileName: string): Promise<string>;
    PayrollExcelReport(sheets: PayrollReportSheetDto[], fileName: string): Promise<string>;
}
