import { IsObject } from 'class-validator';

export class CreateFormSubmissionDto {
  @IsObject()
  formData: object;
}
