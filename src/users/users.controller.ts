import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { UsersService } from "./users.service.js";
import { CurrentUser } from "../common/decorators/current-user.decorator.js";
import { UpdatePrivacyDto } from "./dto/update-privacy.dto.js";

@UseGuards(JwtAuthGuard)
@Controller('users/me')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    getProfile(@CurrentUser() user: { userId: string }) {
        return this.usersService.getProfile(user.userId);
    }

    @Patch('privacy')
    updatePrivacy(@CurrentUser() user: { userId: string }, @Body() dto: UpdatePrivacyDto) {
        return this.usersService.updatePrivacySettings(user.userId, dto);
    }

    @Get('export')
    exportData(@CurrentUser() user: { userId: string }) {
        return this.usersService.exportData(user.userId)
    }

    @Delete()
    deleteAccount(@CurrentUser() user: {userId: string}) {
        return this.usersService.deleteAccount(user.userId);
    }

    @Post('block/:userId')
    blockUser(@CurrentUser() user: { userId: string }, @Param('userId') blockedUserId: string) {
        return this.usersService.blockUser(user.userId, blockedUserId)
    }
}