import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthenticationModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FormSubmissionModule } from './form-submission/form-submission.module';

@Module({
  imports: [
    DatabaseModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
    AuthenticationModule,
    UsersModule,
    FormSubmissionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
