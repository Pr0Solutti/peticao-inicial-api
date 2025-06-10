import { Injectable } from '@nestjs/common';
import {
  FormSubmission,
  FormSubmissionDocument,
} from '../schemas/form-submission.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FormData } from '../schemas/form-data.schema';
import { CreateFormSubmissionDto } from '../dtos/form-submission.dto';

@Injectable()
export class UpdateFormSubmissionService {
  constructor(
    @InjectModel(FormSubmission.name)
    private submissionModel: Model<FormSubmissionDocument>,
  ) {}

  async execute(
    id: string,
    updateData: Partial<CreateFormSubmissionDto>,
  ): Promise<FormSubmission> {
    try {
      console.log(updateData);
      const updatedSubmission = await this.submissionModel.findByIdAndUpdate(
        id,
        { formData: updateData }, // Atualiza apenas o campo formData
        { new: true }, // Retorna o documento atualizado
      );

      if (!updatedSubmission) {
        throw new Error(`Registro com ID ${id} não encontrado.`);
      }

      return updatedSubmission;
    } catch (error) {
      throw new Error(`Erro ao atualizar registro: ${error}`);
    }
  }
}
