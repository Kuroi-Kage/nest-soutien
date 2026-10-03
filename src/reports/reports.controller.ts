import { Body, Controller, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { ReportsService } from "./reports.service.js";
import { CurrentUser } from "../common/decorators/current-user.decorator.js";
import { CreateReportDto } from "./dto/reports.dto.js";
import { RolesGuard } from "../common/guards/roles.guard.js";
import { Roles } from "../common/decorators/roles.decorator.js";


@Controller()
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}

    @Post('posts/:postId/reports')
    fileReport(
        @CurrentUser() user: { userId: string },
        @Param('postId') postId: string,
        @Body() dto: CreateReportDto,
    ) {
        return this.reportsService.listOpenReports();
    }

    @UseGuards(RolesGuard)
    @Roles('MODERATOR', 'ADMIN')
    @Patch('moderation/posts/:postId/hide')
    hidePost(@Param('postId') postId: string) {
        return this.reportsService.hidePost(postId);
    }

    @UseGuards(RolesGuard)
    @Roles('MODERATOR', 'ADMIN')
    @Patch('moderation/reports/:reportId/resolve')
    resolve(@CurrentUser() user: { userId: string }, @Param('reportId') reportId: string) {
        return this.reportsService.resolveReport(user.userId, reportId, 'RESOLU')
    }

    @UseGuards(RolesGuard)
    @Roles('MODERATOR', 'ADMIN')
    @Patch('moderation/reports/:reportId/reject')
    reject(@CurrentUser() user: { userId: string }, @Param('reportId') reportId: string) {
        return this.reportsService.resolveReport(user.userId, reportId, 'REJETE');
    }
}