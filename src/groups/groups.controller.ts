import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { GroupsService } from "./groups.service.js";
import { RolesGuard } from "../common/guards/roles.guard.js";
import { Roles } from "../common/decorators/roles.decorator.js";
import { CreateGroupDto, PostGroupMessageDto } from "./dto/groups.dto.js";
import { CurrentUser } from "../common/decorators/current-user.decorator.js";


@Controller('groupe')
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) {}

    @Get()
    list() {
        return this.groupsService.listGroups();
    }

    @UseGuards(RolesGuard)
    @Roles('ADMIN', 'MODERATOR')
    @Post()
    create(@Body() dto: CreateGroupDto) {
        return this.groupsService.createGroup(dto);

    }

    @Get('mine')
    min(@CurrentUser() user: {userId: string}) {
        return this.groupsService.myGroups(user.userId);
    }

    @Post(':id/join')
    join(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
        return this.groupsService.join(user.userId, id);
    }

    @Delete(':id/leave')
    leave(@CurrentUser() user: { userId: string}, @Param('id') id: string) {
        return this.groupsService.leave(user.userId, id);
    }

    @Get(':id/messages')
    listMessages(@CurrentUser() user: { userId: string}, @Param('id') id: string) {
        return this.groupsService.listMessages(user.userId, id);
    }

    @Post(':id/messages')
    postMessage(
        @CurrentUser() user:{ userId: string},
        @Param('id') id: string,
        @Body()dto: PostGroupMessageDto,
    ) {
        return this.groupsService.postMessage(user.userId, id, dto);
    }
}