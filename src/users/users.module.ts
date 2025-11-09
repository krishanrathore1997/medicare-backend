import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Module({
  imports: [
    // ✅ This line gives Nest access to UserRepository
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [],
  providers: [UsersService],
  exports: [UsersService], // ✅ So AuthService can use it
})
export class UsersModule {}
