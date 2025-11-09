import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  password?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  image?: string;

  @IsOptional()
  provider?: string;

  @IsOptional()
  providerId?: string;

  @IsOptional()
  roleId?: number;
}
