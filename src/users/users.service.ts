import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';


@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async findByUsernameOrEmail(usernameOrEmail: string) {
        return this.prisma.user.findFirst({
            where: {
                OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
                deletedAt: null,
            },
        });
    }

    async existsByUsernameOrEmail(username: string, email?: string) {
        const existing = await this.prisma.user.findFirst({
            where: {
                OR: [{ username }, ...(email ? [{ email }] : [])]
            },
        });
        return !!existing;
    }

    async createAccount(username: string, passwordHash: string, email?: string) {
        return this.prisma.user.create({
            data: { username, email, passwordHash, privacySettings: { create: {} } },
        });
    }

    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                avatarUrl: true,
                role: true,
                createdAt: true,
                privacySettings: true,
            },
        });
        if (!user) throw new NotFoundException('Utilisateur introuvable');
        return user;
    }

    async updatePrivacySettings(userId: string, data: Partial<{
        historyEnabled: boolean;
        notificationsEnabled: boolean;
        defaultVisibility: 'PRIVE' | 'ANONYME' | 'PUBLIC';
        biometricAuthEnabled: boolean;
        autoLogoutMinutes: number;
    }>) {
        return this.prisma.privacySettings.update({
            where: { userId },
            data,
        });
    }

    async exportData(userId: string) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
                privacySettings: true,
                journalEntries: true,
                posts: true,
                conversations: { include: { messages: true } },
            },
        });

    }

    async deleteAccount(userId: string) {
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: userId },
                data: { deletedAt: new Date(), email: null, passwordHash: 'deleted' },

            }),
            this.prisma.journalEntry.deleteMany({ where: { userId } }),
            this.prisma.conversation.deleteMany({ where: { userId } }),
        ]);
        return { success: true };
    }

    async blockUser(userId: string, blockedUserId: string) {
        return this.prisma.userBlock.create({ data: { userId, blockedUserId } });
    }
}


