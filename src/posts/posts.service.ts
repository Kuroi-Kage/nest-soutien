import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { ChangeVisibilityDto, CreatePostDto, ReactDto } from "./dto/posts.dto.js";


@Injectable()
export class PostsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(userId: string, dto:CreatePostDto) {
        return this.prisma.post.create({
            data: { authorId: userId, content: dto.content, visibility: dto.visibility as any },

        });
    }

    async feed(cursor?: string, take = 20) {
        const posts = await this.prisma.post.findMany({
            where: {
                visibility: { in: ['ANONYME', 'PUBLIC'] },
                isHidden: false,
                author: { deletedAt: null },
            },
            orderBy: { createdAt: 'desc'},
            take,
            ...(cursor ? { skip: 1, cursor: {id: cursor } } : {}),
            include: {
                author: { select: { id: true, username: true } },
                _count: { select: { reactions: true } },
            },
        });

        return posts.map((posts) => ({
            id: posts.id, 
            content: posts.content,
            Visibility: posts.visibility,
            createdAt: posts.createdAt,
            reactionCount: posts._count.reactions,
            author: posts.visibility === 'PUBLIC' ? posts.author : null,
        }));
    }

    async myPost(userId: string) {
        return this.prisma.post.findMany({ where: { authorId: userId }, orderBy: { createdAt: 'desc'} });

    }

    async changeVisibility(userId: string, postId: string, dto: ChangeVisibilityDto) {
        const post = await this.getOwnedPost(userId, postId);
        return this.prisma.post.update({ where: {id: post.id }, data: { visibility: dto.visibility as any } });

    }

    async remove(userId: string, postId: string) {
        const post = await this.getOwnedPost(userId, postId);
        await this.prisma.post.delete({ where: { id: post.id } });
        return { success: true };
    }

    async react(userId: string, postId: string, dto: ReactDto) {
        const post = await this.prisma.post.findUnique({ where: { id: postId } });
        if (!post || post.isHidden) throw new NotFoundException('Publication introuvable');

        return this.prisma.reaction.upsert({
            where: { postId_userId_type: {postId, userId, type: dto.type as any } },
            update: {},
            create: { postId, userId, type:dto.type as any },
        });
    }

    private async getOwnedPost(userId: string, postId: string) {
        const post = await this.prisma.post.findFirst({ where: { id: postId } });
        if (!post) throw new NotFoundException('Publication introuvable');
        if (post.authorId !== userId) throw new ForbiddenException("Vous n'êtes pas l'auteur de cette publication");
        return post;
    }
}