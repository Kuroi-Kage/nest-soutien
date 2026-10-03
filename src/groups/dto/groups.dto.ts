import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

export class CreateGroupDto {
    @IsString()
    @MinLength(2)
    name: string;

    @IsOptional()
    @IsString()
    theme?: string;

    @IsOptional()
    @IsBoolean()
    isAnonymousByDefault?: boolean;
}

export class PostGroupMessageDto {
    @IsString()
    @MinLength(1)
    content: string;

    @IsOptional()
    @IsBoolean()
    isAnonymous?: boolean;
}