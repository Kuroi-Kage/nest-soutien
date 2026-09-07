import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @IsString()
    @MinLength(3)
    username: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsString()
    @MinLength(8)
    password: string;

}

export class LoginDto {
    @IsString()
    usernameOrEmail: string;

    @IsString()
    password: string;
}
