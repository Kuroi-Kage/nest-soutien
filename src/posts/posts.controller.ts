import { Body, Controller, Delete, Get, Param, Patch, Post as HttpPost, Query, UseGuards } from "@nestjs/common";
import { PostsService } from "./posts.service.js";
import { CurrentUser } from "../common/decorators/current-user.decorator.js";
import { ChangeVisibilityDto, CreatePostDto, ReactDto } from "./dto/posts.dto.js";


@Controller('posts')
export class PostsController {
    constructor (private readonly postsService: PostsService) {}

    @HttpPost()
    create(@CurrentUser() user: { userId: string}, @Body() dto: CreatePostDto) {
        return this.postsService.create(user.userId, dto);
    }

    @Get('feed')
    feed(@Query('cursor') cursor?: string) {
        return this.postsService.feed(cursor);
    }

    @Get('mine')
    mine(@CurrentUser() user: { userId: string }) {
        return this.postsService.myPost(user.userId);
    }

    @Patch(':id/visibility')
    changeVisibility(
        @CurrentUser() user: { userId: string },
        @Param('id') id: string,
        @Body() dto: ChangeVisibilityDto,
    ) {
        return this.postsService.changeVisibility(user.userId, id, dto);
    }

    @HttpPost(':id/react')
        react(@CurrentUser() user: { userId: string }, @Param('id') id: string, @Body() dto: ReactDto ){
            return this.postsService.react(user.userId, id, dto);
        }
    @Delete(':id')
    remove(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
        return this.postsService.remove(user.userId, id);
    }
}