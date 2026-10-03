import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { MusicService } from "./music.service.js";
import { RolesGuard } from "../common/guards/roles.guard.js";
import { Roles } from "../common/decorators/roles.decorator.js";
import { CreateTrackDto } from "./dto/music.dto.js";
import { CurrentUser } from "../common/decorators/current-user.decorator.js";


@Controller('music')
export class MusicController {
    constructor(private readonly musicService: MusicService) {}

    @Get('tracks')
    listTracks(@Query('ambiance') ambiance?: string) {
        return this.musicService.listTracks(ambiance);
    }

    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Post('tracks')
    createTrack(@Body() dto: CreateTrackDto) {
        return this.musicService.createTrack(dto);
    }

    @Get('favorites')
    listFavorites(@CurrentUser() user: { userId: string }) {
        return this.musicService.listFavorites(user.userId);
    }

    @Post('favorites/:trackId')
    addFavorite(@CurrentUser() user: { userId: string }, @Param('trackId') trackId: string) {
        return this.musicService.addFavorite(user.userId, trackId);
    }

    @Delete('favorites/:trackId')
    removeFavorite(@CurrentUser() user: { userId: string }, @Param('trackId') trackId: string) {
        return this.musicService.removeFavorite(user.userId, trackId);
    }
}