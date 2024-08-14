import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Exclude, Type } from "class-transformer";
import { IsArray, IsDateString, IsNotEmpty, IsOptional } from "class-validator";
import { Priority } from "src/config/constants";

export class CreateProjectDto implements Prisma.ProjectUncheckedCreateInput {
    
    @ApiProperty()
    @IsNotEmpty({message: "Please provide valid project title"})
    title: string;
    
    @ApiProperty()
    @IsNotEmpty({message: "Please provide valid client ID"})
    @Type(() => Number)
    clientId?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    clientRepresentativeId?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @Type(() => Number)
    projectInchargeId?: number[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @Type(()=> Number)
    supportEngineersId?: number[]

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @Type(()=> Number)
    clients?: number[]
    
    @ApiProperty()
    @IsNotEmpty({message: "Please provide valid project type"})
    @Type(() => Number)
    projectTypeId?: number;
    
    @ApiPropertyOptional()
    @IsOptional()
    quoteNumber?: string;
    
    @ApiPropertyOptional()
    @IsOptional()
    projectFilesLink?: string;
    
    @ApiPropertyOptional()
    @IsOptional()
    xeroReference?: string;
    
    @ApiProperty()
    @IsNotEmpty({message: "Please provide valid project start date"})
    @IsDateString()
    startDate?: string | Date;
    
    @ApiProperty()
    @IsNotEmpty({message: "Please provide valid project end date"})
    @IsDateString()
    endDate?: string | Date;
    
    @ApiPropertyOptional({enum: Priority})
    @IsOptional()
    @Type(() => Number)
    priority?: number ;
    
    @ApiPropertyOptional()
    @IsOptional()
    instructions?: string;
    
    @ApiProperty()
    @IsNotEmpty({message: "Please provide sybmissing by"})
    @Type(() => Number)
    submissionById?: number;

    @Exclude()
    addedById?: number;

    @ApiPropertyOptional()
    @IsOptional()
    referenceNumber?: string;
}
