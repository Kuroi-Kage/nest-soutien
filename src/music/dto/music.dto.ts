import { IsInt, IsString, IsUrl, Min, MinLength } from "class-validator";

export class CreateTrackDto {
    @IsString()
    @MinLength(1)
    title: string;

    @IsString()
    @MinLength(1)
    ambiance: string;

    @IsInt()
    @Min(1)
    durationSeconds: number;

    @IsUrl()
    url: string;
}