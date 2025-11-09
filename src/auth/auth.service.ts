import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { SocialLoginNextAuthDto } from './dto/social-login-nextauth.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  /** 🔑 Generate JWT tokens */
  private signTokens(user: User) {
    const accessToken = this.jwt.sign(
      { sub: user.id, email: user.email },
      {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      },
    );

    const refreshToken = this.jwt.sign(
      { sub: user.id },
      {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );

    return { accessToken, refreshToken };
  }

  /** 🔐 Register user (email/password) */
  async register(email: string, password: string, name: string) {
    try {
      const existing = await this.usersService.findByEmail(email);
      if (existing) throw new BadRequestException('Email already registered');
      const user = await this.usersService.create({
        email,
        name,
        password: password,
      });

      const tokens = this.signTokens(user);
      delete (user as any).password;

      return { user, ...tokens };
    } catch (err) {
      throw new InternalServerErrorException(err.message || 'Registration failed');
    }
  }

  /** 🧠 Validate login and issue tokens */
  async login(dto: LoginDto) {
    const user = await this.usersService.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const tokens = this.signTokens(user);
    delete (user as any).password;

    return {
      message: 'Login successful',
      user,
      ...tokens,
    };
  }

  /** 🌐 Social login (NextAuth) */
  async socialLoginNextAuth(dto: SocialLoginNextAuthDto) {
    const user = await this.usersService.upsertSocialUser({
      email: dto.email,
      name: dto.name,
      image: dto.image,
      provider: dto.provider,
      providerId: dto.providerId,
    });

    const tokens = this.signTokens(user);
    delete (user as any).password;

    return { user, ...tokens };
  }

  /** 👤 Fetch authenticated user */
  async me(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    delete (user as any).password;
    return user;
  }
}
