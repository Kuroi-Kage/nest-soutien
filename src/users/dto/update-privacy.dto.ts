import { IsBoolean, IsEnum, IsInt, IsOptional, Max, Min } from "class-validator";

enum VisibilityDto {
    PRIVE = 'PRIVE',
    ANONYME = 'ANONYME',
    PUBLIC = 'PUBLIC',
}

export class UpdatePrivacyDto {
    @IsOptional()
    @IsBoolean()
    hstoryEnabled?: boolean;

    @IsOptional()
    @IsBoolean()
    notificationsEnabled?: boolean;

    @IsOptional()
    @IsEnum(VisibilityDto)
    defaultVisibility?: VisibilityDto;

    @IsOptional()
    @IsBoolean()
    biometricAuthEnabled?: boolean;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(120)
    autoLogoutMinutes?: number;

    
}