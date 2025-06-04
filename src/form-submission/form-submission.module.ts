import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FormSubmission,
  FormSubmissionSchema,
} from './schemas/form-submission.schema';
import { FormSubmissionController } from './form-submission.controller';
import { CreateFormSubmissionService } from './services/create.service';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/user/user.module';
import { AttachmentService } from './services/attachment.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FormSubmission.name, schema: FormSubmissionSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule,
  ],
  controllers: [FormSubmissionController],
  providers: [CreateFormSubmissionService, AttachmentService],
})
export class FormSubmissionModule {}
