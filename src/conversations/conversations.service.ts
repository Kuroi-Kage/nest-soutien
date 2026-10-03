import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { RiskService } from "../risk/risk.service.js";
import { AiGatewayClient } from "./ai-gateway.client.js";
import { decryptContent, encryptContent } from "../common/crypto.util.js";
import { Sender } from "../generated/prisma/enums.js";

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
        return { success: true};
    }

    async lockConversation(userId: string, conversationId: string) {
        const conversation = await this.prisma.conversation.findFirst({ where: { id: conversationId, userId }});
        if (!conversation) throw new NotFoundException('Conversation introuvable');
        return this.prisma.conversation.update({ where: {id: conversationId}, data: {isLocked: true}});
    }

    async getConversation(userId: string, conversationId: string) {
        const conversation = await this.prisma.conversation.findFirst({
            where: { id: conversationId, userId},
            include: { messages: {orderBy: { sentAt: 'asc'}}},
        });
        if (!conversation) throw new NotFoundException('Conversation introuvable');

        return {
            ...conversation,
            messages: conversation.messages.map((m) => ({
                ...m,
                content: decryptContent(m.encryptedContent),
                encryptedContent: undefined,
            }))
        };
    }

    async sendMessage(userId: string, conversationId: string, content: string, countryCode: string) {
        const conversation = await this.prisma.conversation.findFirst({
            where: { id: conversationId, userId },
            include: { messages: { orderBy: {sentAt: 'asc' }, take: 20 }},
        });
        if (!conversation) throw new NotFoundException('Conversation introuvable');
        if (conversation.isLocked) throw new ForbiddenException('Cette conversation est verroullée');


        const { level } = this.riskService.assessMessage(content);

        const userMessage = await this.prisma.message.create({
            data: {
                conversationId,
                sender: Sender.USER,
                encryptedContent: encryptContent(content),
                riskLevel: level,
            },
        });

        let riskAlert = null;
        if (level !== 'NONE') {
            riskAlert = await this.prisma.riskAlert.create({
                data: {
                    messageId: userMessage.id,
                    userId,
                    level,
                    escalated: this.riskService.shouldEscalateToModerator(level),
                    recommendedAction:
                    level === 'CRITICAL'
                    ?'Orienter immédiatement vers les resources d\'urgent et un modéeateur'
                    : 'Proposer des ressources et surveiller la conversation'
                },
            });
        }

        const history = [
            ...conversation.messages.map((m) => ({
                role: (m.sender === Sender.USER ? 'user' : 'assistant') as 'user' | 'assistant',
                content: decryptContent(m.encryptedContent),
            })),
            {role: 'user' as const, content },
        ];

        const assistantReplyText = await this.aiGateway.getAssistanReply(history);

        const assistantMessage = await this.prisma.message.create({
            data: {
                conversationId,
                sender: Sender.ASSISTANT,
                encryptedContent: encryptContent(assistantReplyText),
                riskLevel: 'NONE',
            },
        });

        return {
            userMessage: { ...userMessage, content, encryptContent: undefined },
            assistantMessage: { ...assistantMessage, content: assistantReplyText, encrptedContent: undefined },
            riskAlert,
            emergencyResources:
            riskAlert && level === 'CRITICAL' ? this.riskService.getEmergencyResources(countryCode) : undefined,
        };
    }

} 