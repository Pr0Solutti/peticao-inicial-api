import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../schema/user.schema';
import { CreateUserDto } from '../dto/user.dto';

@Injectable()
export class CreateUserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async execute(user: CreateUserDto): Promise<User> {
    const verifyIfUserExists = await this.userModel.findOne({
      email: user.email,
    });
    if (verifyIfUserExists) {
      throw new BadRequestException('User already exists');
    }

    try {
      const passwordHadhed = await bcrypt.hash(user.password, 10);
      const createdUser = await this.userModel.create({
        ...user,
        password: passwordHadhed,
      });

      return createdUser;
    } catch (error: unknown) {
      console.error('Error creating user:', error);
      throw new Error('Error creating user');
    }
  }
}
