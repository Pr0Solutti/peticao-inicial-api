import { IsMongoId, IsObject } from 'class-validator';

export class CreateFormSubmissionDto {
  @IsMongoId()
  userId: string;

  @IsObject()
  formData: object;
}
