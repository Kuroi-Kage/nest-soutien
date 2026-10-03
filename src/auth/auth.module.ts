import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service.js';
import { PasswordService } from './password/password.service.js';
import { TokenService } from './token/token.service.js';
import { UsersModule } from '../users/users.module.js';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy/jwt.strategy.js';
import { AuthController } from './auth.controller.js';
import type { StringValue } from 'ms';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard.js';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn:( process.env.JWT_EXPIRES_IN ?? '7d') as StringValue },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, 
        JwtStrategy, 
        PasswordService, 
        TokenService,
        { provide: APP_GUARD, useClass: JwtAuthGuard },
    ],
    exports: [JwtModule],
})
export class AuthModule {}
