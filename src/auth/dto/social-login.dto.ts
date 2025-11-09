import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum AuthProvider {
  GOOGLE = 'google',
  GITHUB = 'github',
}

export class SocialLoginDto {
  @IsEnum(AuthProvider)
  provider: AuthProvider;

  @IsString()
  @IsString()
  @IsOptional()
  token?: string;

  @IsString()
  @IsOptional()
  accessToken?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  providerId?: string;
}