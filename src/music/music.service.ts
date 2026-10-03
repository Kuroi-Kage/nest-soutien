import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateTrackDto } from "./dto/music.dto.js";

@Injectable()
export class MusicService {
    constructor(private readonly prisma: PrismaService) {}

    async listTracks(ambiance?: string) {
        return this.prisma.musicTrack.findMany({
            where: ambiance ? { ambiance } : undefined,
            orderBy: { title: 'asc'},
        });
    }

    async createTrack(dto: CreateTrackDto) {
       return this.prisma.musicTrack.create({ data: dto});
    }

    async listFavorites(userId: string) {
        const favorites = await this.prisma.userFavoriteTrack.findMany({
            where: { userId },
            include: { track: true },
            orderBy: { addedAt: 'desc'},
        });
        return favorites.map((f) => f.track);
    }

    async addFavorite(userId: string, trackId: string) {
        const track = await this.prisma.musicTrack.findUnique({ where: { id: trackId } });
        if(!track) throw new NotFoundException('Morceau introuvable');
        return this.prisma.userFavoriteTrack.upsert({
            where:  { userId_trackId: { userId, trackId } },
            update: {},
            create: { userId, trackId },
        });
    }

    async removeFavorite(userId: string, trackId: string) {
        await this.prisma.userFavoriteTrack.deleteMany({ where: { userId, trackId } });
        return { success: true };
    }
}