import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { JournalService } from "./journal.service.js";
import { CurrentUser } from "../common/decorators/current-user.decorator.js";
import { CreateJournalEntryDto } from "./dto/journal.dto.js";


@Controller('journal')
export class JournalController {
    constructor(private readonly journalService: JournalService) {}

    @Post()
    create(@CurrentUser() user: { userId: string }, @Body() dto: CreateJournalEntryDto) {
        return this.journalService.create(user.userId, dto);
    }

    @Get()
    list(@CurrentUser() user: { userId: string }) {
        return this.journalService.listMine(user.userId);
    }

    @Get('mood-history')
    moodHistory(@CurrentUser() user: { userId: string }, @Query('days') days?: string) {
        return this.journalService.moodHistory(user.userId, days ? parseInt(days, 10): undefined);

    }

    @Delete(':id')
    remove(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
        return this.journalService.remove(user.userId, id);
    }
}