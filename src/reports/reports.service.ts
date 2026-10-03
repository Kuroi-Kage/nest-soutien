import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateReportDto } from "./dto/reports.dto.js";

@Injectable()
export class ReportsService {
    constructor(private readonly prisma: PrismaService) {}

    async fileReport(reporterId: string, postId: string, dto: CreateReportDto) {
        const post = await this.prisma.post.findUnique({ where: { id: postId } });
        if (!post) throw new NotFoundException('Publication introuvable');

        return this.prisma.report.create({
            data: { postId, reporterId, reason: dto.reason as any, description: dto.description },
        });
    }

    async listOpenReports() {
        return this.prisma.report.findMany({
            where: { status: { in: ['OUVERT', 'EN_COURS']}},
            orderBy: { createdAt: 'asc'},
            include: { post: true},
        });
    }

    async hidePost(postId: string) {
        return this.prisma.post.update({ where: { id: postId }, data: { isHidden: true} }); 
    }

    async resolveReport(moderatorId: string, reportId: string, status: 'RESOLU' | 'REJETE') {
        const report = await this.prisma.report.findUnique({ where: { id: reportId } });
        if (!report) throw new NotFoundException('Signalement introuvable');

        return this.prisma.report.update({
            where: { id: reportId},
            data: { status, resolvedBy: moderatorId, resolvedAt: new Date() },
        });
    }
}