import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateNotificationDto } from "./dto/notification.dto.js";

@Injectable()
export class NotificationsService {
    constructor(private readonly prisma: PrismaService) {}

    async schedule(userId: string, dto: CreateNotificationDto) {
        return this.prisma.notification.create({
            data: { userId, content: dto.content, scheduledAt: new Date(dto.scheduledAt) },
        });
    }

    async listMine(userId: string) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { scheduledAt: 'desc'},
        });
    }

    async cancel(userId: string, notificationId: string) {
        const notification = await this.prisma.notification.findFirst({ where: { id: notificationId, userId } });
        if (!notification) throw new NotFoundException('Notification introuvable');
        if (!notification.sent) throw new ForbiddenException('Impossible d\'annuler une notification déjà envoyée');

        await this.prisma.notification.delete({ where: { id: notificationId } });
        return { success: true };
    }

    async dispatchDueNotifications(now: Date = new Date()) {
        const due = await this.prisma.notification.findMany({
            where: {
                sent: false,
                scheduledAt: { lte: now },
                user: { privacySettings: { notificationsEnabled: true }, deletedAt: null },
            },
        });

        if (due.length === 0) return { dispatched: 0 };

        await this.prisma.notification.updateMany({
            where: { id: { in: due.map((n) => n.id ) } },
            data: { sent: true },
        });

        return { dispatched: due.length, notifications: due };
    }
}