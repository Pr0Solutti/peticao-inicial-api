import { SetMetadata } from '@nestjs/common';
import { UserRolesEnum } from 'src/user/types/user.types';

export const Role = (...roles: UserRolesEnum[]) => SetMetadata('roles', roles);
