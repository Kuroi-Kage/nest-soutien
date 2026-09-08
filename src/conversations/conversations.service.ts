import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { RiskService } from "../risk/risk.service.js";
import { AiGatewayClient } from "./ai-gateway.client.js";

@Injectable()
export class ConversationsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly riskService: RiskService,
        private readonly aiGateway: AiGatewayClient,
    ) {}

    async listConversations(userId: string) {
        return this.prisma.conversation.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            select: { id: true, createdAt: true, isLocked: true },
        });
    }

    async createConversation(userId: string) {
        return this.prisma.conversation.create({ data: {userId }});
    }

    async deleteConversation(userId: string, conversationId: string) {
        const conversation = await this.prisma.conversation.findFirst({
            where: { id: conversationId, userId}
        });
        if (!conversation) throw new NotFoundException('Conversation introuvable');
        await this.prisma.conversation.delete({ where: { id: conversationId }});
    }

    async lockConversation(userId: String, conversationId: string) {
        const conversation = await this.prisma.conversation.findFirst({ where: { id: conversationId, userId }});
        if (!conversation) throw new NotFoundException('Conversation introuvable');
        return this.prisma.conversation.update({ where: {id: conversationId}, data: {isLocked: true}});
    }

} 