import { IsEnum, IsOptional, IsString } from "class-validator";

enum ReportReasonDto {
    HARCELEMENT = 'HARCELEMENT',
    INSULTES = 'INSULTES',
    CONTENU_DANGEREUX = 'CONTENU_DANGEREUX',
    MENACE = 'MENACE',
    CONTENU_INAPPROPRIE = 'CONTENU_INAPPROPRIE',
    DISCRIMINATION = 'DISCRIMINATION',
    SPAM = 'SPAM',
    AUTRE = 'AUTRE',
}

export class CreateReportDto {
    @IsEnum(ReportReasonDto)
    reason: ReportReasonDto;

    @IsOptional()
    @IsString()
    description?: string;
}