import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';
import { serialize } from 'cookie';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginUserDto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.execute(loginUserDto);

    res.setHeader(
      'Set-Cookie',
      serialize('@peticaoinicial:accessToken', accessToken, {
        httpOnly: true,
        secure: false, // true em produção com HTTPS
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      }),
    );

    return { message: 'Login successful' };
  }
}
