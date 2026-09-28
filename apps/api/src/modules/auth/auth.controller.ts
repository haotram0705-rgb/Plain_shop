import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Post('login')
  async login(@Body() body: { email: string; password: string }, @Res({ passthrough: true }) response: Response) {
    const result = await this.auth.login(body.email, body.password);
    response.cookie('plant_shop_api_session', result.token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 8 * 60 * 60 * 1000 });
    return result;
  }
}
