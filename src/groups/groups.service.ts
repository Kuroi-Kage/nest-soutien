import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateGroupDto, PostGroupMessageDto } from "./dto/groups.dto.js";

@Injectable()
export class GroupsService {
    constructor (private readonly prisma: PrismaService) {}

    async listGroups() {
        return this.prisma.groupDiscussion.findMany({
            orderBy: {createdAt: 'desc'},
            select: {
                id: true,
                name: true,
                theme: true,
                isAnonymousByDefault: true,
                createdAt: true,
                _count: {select: { members: true } },
            },
        });
    }

    async createGroup(dto: CreateGroupDto) {
        return this.prisma.groupDiscussion.create({ data: dto });

    }

    async myGroups(userId: string) {
        const memberships = await this.prisma.groupMember.findMany({
            where: { userId },
            include: { group: true },

        });
        return memberships.map((m) => m.group);
    }

    async join(userId: string, groupId: string) {
        const group = await this.prisma.groupDiscussion.findUnique({ where: { id: groupId }});
        if (!group) throw new NotFoundException('Groupe introuvable');

        return this.prisma.groupMember.upsert({
            where: { groupId_userId: { groupId, userId }},
            update: {},
            create: { groupId, userId },
        });
    }

    async leave(userId: string, groupId: string) {
        await this.prisma.groupMember.deleteMany({ where: { groupId, userId } });
        return { success: true };
    }

    private async asserMember(userId: string, groupId: string) {
        const group = await this.prisma.groupDiscussion.findUnique({ where: { id: groupId }});
        if (!group) throw new NotFoundException('Groupe introuvable');

        const memberships = await this.prisma.groupMember.findUnique({
            where: { groupId_userId: {groupId, userId}},
        });
        if (!memberships) throw new ForbiddenException('Vous devez rejoindre ce groupe y accéder');

        return group;
    }

    async listMessages(userId: string, groupId: string) {
        await this.asserMember(userId, groupId);

        const message = await this.prisma.groupMessage.findMany({
            where: { groupId },
            orderBy: {createdAt: 'asc'},
            include: { user: {select: {id: true, username: true} } ,}
        });

        return message.map((m) =>({
            id: m.id,
            content: m.content,
            createdAt: m.createdAt,
            author: m.isAnonymous ? null : m.user,
        }));
    }

    async postMessage(userId: string, groupId: string, dto: PostGroupMessageDto) {
        const group = await this.asserMember(userId, groupId);

        return this.prisma.groupMessage.create({
            data: {
                groupId,
                userId,
                content: dto.content,
                isAnonymous: dto.isAnonymous ?? group.isAnonymousByDefault,
            },
        });
    }
}