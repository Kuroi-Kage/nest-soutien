import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { ConfigModule } from '@nestjs/config'
import { ConversationsModule } from './conversations/conversations.module.js';
import Joi from 'joi';
import { JournalModule } from './journal/journal.module.js';
import { PostsModule } from './posts/posts.module.js';
import { ReportsModule } from './reports/reports.module.js';
import { MusicModule } from './music/music.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { GroupsModule } from './groups/groups.module.js';

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  CONTENT_ENCRYPTION_SECRET: Joi.string().min(32).required(),
  CORS_ORIGIN: Joi.string().default('*'),
  AI_GATEWAY_URL: Joi.string().uri().optional(),
  AI_GATEWAY_API_KEY: Joi.string().optional(),
}).unknown(true);

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      validate: (config) => {
        const {error, value} = envSchema.validate(config,{ abortEarly: false });
        if (error) {
          throw new Error(`Variable d'environnement invalide :\n${error.message}`);
        }
        return value;
      },
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ConversationsModule,
    JournalModule,
    PostsModule,
    ReportsModule,
    MusicModule,
    NotificationsModule,
    GroupsModule,

    ],
})
export class AppModule {}
