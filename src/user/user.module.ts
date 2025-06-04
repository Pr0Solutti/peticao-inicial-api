import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationModule } from 'src/auth/auth.module';
import { User, UserSchema } from './schema/user.schema';
import { UserController } from './user.controller';
import { CreateUserService } from './services/create.service';
import { PassportModule } from '@nestjs/passport';
import { FindByIdUserService } from './services/find-by-id.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthenticationModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [UserController],
  providers: [CreateUserService, FindByIdUserService],
  exports: [FindByIdUserService],
})
export class UsersModule {}
