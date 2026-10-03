import { Module } from "@nestjs/common";
import { RiskModule } from "../risk/risk.module.js";
import { ConversationsService } from "./conversations.service.js";
import { AiGatewayClient } from "./ai-gateway.client.js";
import { ConversationController } from "./conversations.controller.js";
import { AuthModule } from "../auth/auth.module.js";

@Module({
    imports: [RiskModule, AuthModule],
    controllers: [ConversationController],
    providers: [ConversationsService, AiGatewayClient],
})
export class ConversationsModule {}