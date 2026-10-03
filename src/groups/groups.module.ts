import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { GroupsController } from "./groups.controller.js";
import { GroupsService } from "./groups.service.js";

@Module({
    imports: [],
    controllers: [GroupsController],
    providers: [GroupsService],
})
export class GroupsModule {}