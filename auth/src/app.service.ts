import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './prisma.service.js';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export interface UserPayload {
  id: number;
  email: string;
  role: string;
}

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(data: Prisma.UserCreateInput) {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      return await this.prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          role: 'CLIENT',
        },
      });
    } catch (error) {
      this.logger.error('Error creating user:', error);
      return { error: 'User already exists or failed to create' };
    }
  }

  async validateUser(data: { email: string; password: string }) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (user && (await bcrypt.compare(data.password, user.password))) {
        return { id: user.id, email: user.email, role: user.role };
      }

      return null;
    } catch (error) {
      this.logger.error('Error validating user:', error);
      return null;
    }
  }

  login(user: UserPayload) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }
}
