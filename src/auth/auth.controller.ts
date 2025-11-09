import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './jwt.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { SocialLoginNextAuthDto } from './dto/social-login-nextauth.dto';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  /** 🔐 Register a new user (email + password) */
  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    if (!dto.email || !dto.password) {
      throw new BadRequestException('Email and password are required');
    }

    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new BadRequestException('User already exists');

    const { user, accessToken, refreshToken } = await this.authService.register(
      dto.email,
      dto.password,
      dto.name,
    );

    return {
      message: 'User registered successfully',
      user,
      accessToken,
      refreshToken,
    };
  }

  /** 🔑 Regular login */
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /** 🌐 Social login (NextAuth) */
  @Post('social')
  async socialLoginNextAuth(@Body() dto: SocialLoginNextAuthDto) {
    if (!dto.email || !dto.providerId) {
      throw new BadRequestException('Missing required social login fields');
    }

    const { user, accessToken, refreshToken } =
      await this.authService.socialLoginNextAuth(dto);

    return {
      message: 'Social login successful',
      user,
      accessToken,
      refreshToken,
    };
  }

  /** 👤 Authenticated user profile */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: any) {
    const user = await this.authService.me(req.user.userId);
    return { user };
  }
}
