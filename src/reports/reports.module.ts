import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { ReportsController } from "./reports.controller.js";
import { ReportsService } from "./reports.service.js";

@Module({
    imports: [],
    controllers: [ReportsController],
    providers: [ ReportsService],
})

export class ReportsModule {}