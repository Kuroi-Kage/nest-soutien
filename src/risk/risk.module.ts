import { RiskService } from "./risk.service.js";
import { Module } from "@nestjs/common";

@Module({
    providers: [RiskService],
    exports: [RiskService],
})

export class RiskModule {}