import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { MusicController } from "./music.controller.js";
import { MusicService } from "./music.service.js";

@Module({
    imports: [],
    controllers: [MusicController],
    providers: [MusicService]
})
export class MusicModule {}