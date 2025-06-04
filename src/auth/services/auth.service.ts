import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { AuthDto } from '../dto/auth.dto';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async execute(data: AuthDto) {
    try {
      const user = await this.userModel.findOne({ email: data.email });

      if (!user) {
        throw new BadRequestException('E-mail ou senha inválidos');
      }

      const passwordMatch = await compare(data.password, user?.password || '');
      if (!passwordMatch) {
        throw new BadRequestException('E-mail ou senha inválidos');
      }

      return {
        accessToken: this.jwtService.sign({
          identifier: data.email,
          sub: user._id,
        }),
        user: {
          email: user.email,
          role: user.role,
          name: user.name,
          contact: user.contact,
          _id: user._id,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }
}
