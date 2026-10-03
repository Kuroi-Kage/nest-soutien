import { JournalService } from "./journal.service.js";
import { Module } from "@nestjs/common";
import { JournalController } from "./journal.controller.js";

@Module({
    imports: [],
    controllers: [JournalController],
    providers: [JournalService],
})

export class JournalModule {}