import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/auth.dto/auth.dto.js';
import { PasswordService } from './password/password.service.js';
import { TokenService } from './token/token.service.js';
import { UsersService } from '../users/users.service.js';



@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly passwordService: PasswordService,
        private readonly tokenService: TokenService,
    ) {}

    async register(dto: RegisterDto) {
        const alreadyExists = await this.userService.existsByUsernameOrEmail(dto.username, dto.email);
        if (alreadyExists) {
            throw new ConflictException('Ce pseudonyme ou cet email est déjà utilise');
            
        }

        const passwordHash = await this.passwordService.hash(dto.password);
        const user = await this.userService.createAccount(dto.username, passwordHash, dto.email);
        
        return this.buildAuthResponse(user.id, user.username, user.role);
    }

    async login(dto: LoginDto) {
        const user = await this.userService.findByUsernameOrEmail(dto.usernameOrEmail);
        if (!user) throw new UnauthorizedException('Identifiants invalides');

        const passwordMatches = await this.passwordService.compare(dto.password, user.passwordHash);
        if (!passwordMatches) throw new UnauthorizedException('IDENTIFIANTS INVALIDES');


        return this.buildAuthResponse(user.id, user.username, user.role);
    }

    private buildAuthResponse(userId: string, username: string, role: string) {
        return {
            accessToken: this.tokenService.issueAccesToken({ sub: userId, username, role }),
            user: { id: userId, username, role },
        };
    }
}
