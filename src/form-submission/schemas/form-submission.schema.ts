import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { CreateFormSubmissionDto } from '../dtos/form-submission.dto';

export type FormSubmissionDocument = FormSubmission & Document;

@Schema({ timestamps: true })
export class FormSubmission {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: CreateFormSubmissionDto })
  formData: CreateFormSubmissionDto;
}

export const FormSubmissionSchema =
  SchemaFactory.createForClass(FormSubmission);
