import { IsEnum, IsString, MinLength } from "class-validator";

enum MoodDto {
    TRES_BIEN = 'TRES_BIEN',
    BIEN = 'BIEN',
    NORMAL = 'NORMAL',
    TRISTE = 'TRISTE',
    ANXIEUX = 'ANXIEUX',
    TRES_MAL = 'TRES_MAL',
}

export class CreateJournalEntryDto {
    @IsString()
    @MinLength(1)
    content: string;

    @IsEnum(MoodDto)
    mood: MoodDto;
}