import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { ConversationsService } from "./conversations.service.js";
import { CurrentUser } from "../common/decorators/current-user.decorator.js";
import { SendMessageDto } from "./dto/send-message.dto.js";

@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationController {
    constructor(private readonly conversationsService: ConversationsService) {}

   @Get()
   list(@CurrentUser() user: { userId: string }) {
    return this.conversationsService.listConversations(user.userId);
  }

  @Post()
  create(@CurrentUser() user: { userId: string }) {
    return this.conversationsService.createConversation(user.userId);
  }

  @Get(':id')
  get(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    return this.conversationsService.getConversation(user.userId, id);
  }


  @Post(':id/messages')
  sendMessage(
    @CurrentUser() user: { userId: string},
    @Param('id') id: string,
    @Body() dto: SendMessageDto
  ) {
    return this.conversationsService.sendMessage(user.userId, id, dto.content, dto.countryCode);
  }

  @Patch(':id/lock')
  lock(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    return this.conversationsService.lockConversation(user.userId, id);
  }

  @Delete(':id')
  remove(@CurrentUser() user: {userId: string }, @Param('id') id: string) {
    return this.conversationsService.deleteConversation(user.userId, id);
  }


}