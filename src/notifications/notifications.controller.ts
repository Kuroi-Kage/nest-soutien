import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";

import { NotificationsService } from "./notifications.service.js";
import { CurrentUser } from "../common/decorators/current-user.decorator.js";
import { CreateNotificationDto } from "./dto/notification.dto.js";


@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Post()
    schedule(@CurrentUser() user: { userId: string}, @Body() dto: CreateNotificationDto) {
        return this.notificationsService.schedule(user.userId, dto);
    }

    @Get()
    list(@CurrentUser() user: { userId: string }) {
        return this.notificationsService.listMine(user.userId);
    }

    @Delete(':id')
    cancel(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
        return this.notificationsService.cancel(user.userId, id);
    }
}