import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma/prisma.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthService } from './auth/auth.service.js';
import { PasswordService } from './auth/password/password.service.js';
import { TokenService } from './auth/token/token.service.js';
import { UsersService } from './users/users.service.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
     AuthModule,
      UsersModule,
    ],
  controllers: [AppController],
  providers: [AppService, PrismaService, AuthService, PasswordService, TokenService, UsersService],
})
export class AppModule {}
