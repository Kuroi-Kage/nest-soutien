import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { UsersService } from "./users.service.js";
import { CurrentUser } from "../common/decorators/current-user.decorator.js";

@UseGuards(JwtAuthGuard)
@Controller('users/me')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    getProfile(@CurrentUser() user: { userId: string }) {
        return this.usersService.getProfile(user.userId);
    }
}