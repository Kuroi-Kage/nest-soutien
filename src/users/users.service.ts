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

    async creatAccount(username: string, passwordHash: string, email?: string) {
        return this.prisma.user.create({
            data: { username, email, passwordHash, privacySettings: { create: {} } },
        });
    }

    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id:userId },
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
}


