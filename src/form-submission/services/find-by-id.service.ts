import { Injectable } from '@nestjs/common';
import {
  FormSubmission,
  FormSubmissionDocument,
} from '../schemas/form-submission.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FindByIdFormSubmissionService {
  constructor(
    @InjectModel(FormSubmission.name)
    private submissionModel: Model<FormSubmissionDocument>,
  ) {} // Substitua 'any' pelo tipo correto do repositório

  async execute(id: string) {
    // Substitua 'any' pelo tipo correto do retorno
    try {
      const result = await this.submissionModel.findById(id);
      if (!result) {
        throw new Error(`Registro com ID ${id} não encontrado.`);
      }
      return result;
    } catch (error) {
      throw new Error(`Erro ao buscar registro: ${error}`);
    }
  }
}
