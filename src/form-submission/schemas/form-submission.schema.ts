import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { FormData, FormDataSchema } from './form-data.schema';
import { User } from 'src/user/schema/user.schema';

export type FormSubmissionDocument = FormSubmission & Document;

@Schema({ timestamps: true })
export class FormSubmission {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: FormDataSchema })
  formData: FormData;
}

export const FormSubmissionSchema =
  SchemaFactory.createForClass(FormSubmission);
