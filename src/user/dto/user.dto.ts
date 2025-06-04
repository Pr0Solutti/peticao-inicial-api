import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { UserRolesEnum } from '../types/user.types';

// create-user.dto.ts
export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly contact: string;

  @IsEnum(UserRolesEnum)
  readonly role: UserRolesEnum;

  @IsNotEmpty()
  readonly name: string;
}
