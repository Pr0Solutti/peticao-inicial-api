import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/decorators/role.decorato';
import { RoleGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from './schema/user.schema';
import { CreateUserService } from './services/create.service';
import { UserRolesEnum } from './types/user.types';
import { CreateUserDto } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post()
  @UseGuards(AuthGuard(), RoleGuard)
  @Role(UserRolesEnum.ADMIN)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.createUserService.execute(createUserDto);
  }
}
