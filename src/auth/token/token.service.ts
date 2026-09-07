import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface TokenPayload {
    sub: string;
    username: string;
    role: string;
}

@Injectable()
export class TokenService {
    constructor(private readonly JwtService: JwtService) {}

    issueAccesToken(payload: TokenPayload): string {
        return this.JwtService.sign(payload);
    }
}
