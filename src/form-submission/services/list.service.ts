import { Injectable } from '@nestjs/common';
import {
  FormSubmission,
  FormSubmissionDocument,
} from '../schemas/form-submission.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class ListFormSubmissionService {
  constructor(
    @InjectModel(FormSubmission.name)
    private submissionModel: Model<FormSubmissionDocument>,
  ) {} // Substitua 'any' pelo tipo correto do repositório

  async execute(userId: string) {
    // Substitua 'any' pelo tipo correto do retorno
    try {
      const result = await this.submissionModel.find({
        userId: new mongoose.Types.ObjectId(userId),
      });

      return result;
    } catch (error) {
      throw new Error(`Erro ao buscar registro: ${error}`);
    }
  }
}
