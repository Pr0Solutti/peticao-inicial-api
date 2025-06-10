import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { serialize } from 'cookie';
import { Response } from 'express';
import { UserRolesEnum } from 'src/user/types/user.types';
import { Role } from './decorators/role.decorato';
import { AuthDto } from './dto/auth.dto';
import { RoleGuard } from './guards/jwt-auth.guard';
import { AuthService } from './services/auth.service';

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
        secure: process.env.NODE_ENV === 'production', // true em produção com HTTPS
        sameSite: 'none',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 dias,
      }),
    );

    return { message: 'Login successful' };
  }
  @Get('me')
  @UseGuards(AuthGuard(), RoleGuard)
  @Role(UserRolesEnum.ADMIN, UserRolesEnum.LAWYER)
  getProfile(@Req() req: { user: { id: string; role: UserRolesEnum } }) {
    return req.user;
  }
}
