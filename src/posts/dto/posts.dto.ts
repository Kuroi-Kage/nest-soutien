import { IsEnum, IsString, MinLength } from "class-validator";

enum VisibilityDto {
    PRIVE = 'PRIVE',
    ANONYME = 'ANONYME',
    PUBLIC = 'PUBLIC',
}

enum ReactionTypeDto {
    SOUTIEN = 'SOUTIEN',
    COEUR = 'COEUR',
    FORCE = 'FORCE',
    MERCI = 'MERCI',
}

export class CreatePostDto {
    @IsString()
    @MinLength(1)
    content: string;

    @IsEnum(VisibilityDto)
    visibility: VisibilityDto;
}

export class ChangeVisibilityDto {
    @IsEnum(VisibilityDto)
    visibility: VisibilityDto;
}

export class ReactDto {
    @IsEnum(ReactionTypeDto)
    type: ReactionTypeDto;
}