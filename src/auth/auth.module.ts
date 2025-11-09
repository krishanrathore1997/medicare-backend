import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({}), // Empty config since we'll provide secrets in service
    ConfigModule, // For accessing env variables
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
