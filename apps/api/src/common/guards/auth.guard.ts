import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { Role } from '@prisma/client';
import { AuthenticatedRequest } from './roles.guard';

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) {
    throw new Error('AUTH_SECRET phải được cấu hình với ít nhất 32 ký tự.');
  }
  return value;
}

export function createSessionToken(userId: string, role: Role) {
  const payload = Buffer.from(JSON.stringify({ userId, role, exp: Date.now() + 8 * 60 * 60 * 1000 })).toString('base64url');
  const signature = createHmac('sha256', secret()).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest & { headers: Record<string, string | string[] | undefined> }>();
    const header = request.headers.authorization;
    const token = typeof header === 'string' && header.startsWith('Bearer ') ? header.slice(7) : this.readCookie(request.headers.cookie);
    if (!token) throw new UnauthorizedException('Cần đăng nhập.');
    const [payload, signature] = token.split('.');
    if (!payload || !signature) throw new UnauthorizedException('Phiên đăng nhập không hợp lệ.');
    const expected = createHmac('sha256', secret()).update(payload).digest('base64url');
    if (expected.length !== signature.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) throw new UnauthorizedException('Phiên đăng nhập không hợp lệ.');
    try {
      const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { userId: string; role: Role; exp: number };
      if (parsed.exp < Date.now()) throw new UnauthorizedException('Phiên đăng nhập đã hết hạn.');
      request.user = { id: parsed.userId, role: parsed.role };
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ.');
    }
  }

  private readCookie(value?: string | string[]) {
    const cookie = Array.isArray(value) ? value.join(';') : value || '';
    return cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith('plant_shop_api_session='))?.split('=')[1];
  }
}
