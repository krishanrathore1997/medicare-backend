import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

interface CreateUserParams {
  email: string;
  name?: string;
  password?: string;
  provider?: string;
  providerId?: string;
  image?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 🔍 Find by email
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  // 🔍 Find by ID
  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // 🔑 Validate login credentials
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user?.password) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return user;
  }

  // 🧩 Register a new user
  async create(data: CreateUserParams): Promise<User> {
    const existing = await this.findByEmail(data.email);
    if (existing) {
      throw new UnauthorizedException('Email already exists');
    }

    const passwordHash = data.password
      ? await bcrypt.hash(data.password, 10)
      : null;

    const user = this.userRepository.create({
      email: data.email,
      name: data.name,
      password: passwordHash,
      provider: data.provider,
      providerId: data.providerId,
      image: data.image,
    });

    return this.userRepository.save(user);
  }

  // 🌐 Create or Update (Upsert) for Social Login (NextAuth)
  async upsertSocialUser(data: {
    email: string;
    name: string;
    image?: string;
    provider: string;
    providerId: string;
  }): Promise<User> {
    let user = await this.userRepository.findOne({
      where: [
        { providerId: data.providerId },
        { email: data.email },
      ],
    });

    if (user) {
      user.name = data.name || user.name;
      user.image = data.image || user.image;
      user.provider = data.provider;
      user.providerId = data.providerId;
      await this.userRepository.save(user);
    } else {
      user = this.userRepository.create({
        email: data.email,
        name: data.name,
        image: data.image,
        provider: data.provider,
        providerId: data.providerId,
      });
      await this.userRepository.save(user);
    }

    delete (user as any).password;
    return user;
  }

  // 🧹 Delete user
  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('User not found');
  }
}
