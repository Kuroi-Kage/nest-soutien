import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateJournalEntryDto } from "./dto/journal.dto.js";
import { decryptContent, encryptContent } from "../common/crypto.util.js";

@Injectable()
export class JournalService {
    constructor(private readonly prisma: PrismaService) {}

    async create(userId: string, dto: CreateJournalEntryDto) {
        const entry = await this.prisma.journalEntry.create({
            data: { 
                userId,
                mood: dto.mood as any,
                encryptedContent: encryptContent(dto.content),
            },
        });
        return { ...entry, content: dto.content, encryptedContent: undefined };
    }

    async listMine(userId: string) {
        const entries = await this.prisma.journalEntry.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return entries.map((e) => ({ ...e, content: decryptContent(e.encryptedContent), encryptedContent: undefined}));
    }

    async moodHistory(userId: string, days = 14) {
        const since = new Date();
        since.setDate(since.getDate() - days);
        return this.prisma.journalEntry.findMany({

        where: { userId, createdAt: {gte: since }},
        orderBy: { createdAt: 'asc'},
        select: {createdAt: true, mood: true },
    });
    }

    async remove(userId: string, entryId: string) {
        const entry = await this.prisma.journalEntry.findFirst({
            where: { id: entryId, userId}
        });
        if (!entry) throw new NotFoundException('Entre de journal introuvable');
        await this.prisma.journalEntry.delete({ where: { id: entryId }});
        return { success: true };
    }
}