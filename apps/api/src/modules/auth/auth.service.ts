import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createSessionToken } from '../../common/guards/auth.guard';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    const configuredPassword = process.env.ADMIN_PASSWORD;
    if (!user || !configuredPassword || password !== configuredPassword) throw new UnauthorizedException('Email hoặc mật khẩu không đúng.');
    return { token: createSessionToken(user.id, user.role), user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }
}
