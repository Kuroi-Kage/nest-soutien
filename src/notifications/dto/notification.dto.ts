import { IsDateString, IsString, MinLength } from "class-validator";

export class CreateNotificationDto {
    @IsString()
    @MinLength(1)
    content: string;

    @IsDateString()
    scheduledAt: string;
}