import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FindByIdUserService } from 'src/user/services/find-by-id.service';
import { FormData } from '../schemas/form-data.schema';
import {
  FormSubmission,
  FormSubmissionDocument,
} from '../schemas/form-submission.schema';

@Injectable()
export class CreateFormSubmissionService {
  constructor(
    @InjectModel(FormSubmission.name)
    private submissionModel: Model<FormSubmissionDocument>,
    private findByIdUserService: FindByIdUserService,
  ) {}

  async execute(
    id: string,
    createSubmissionDto: FormData,
  ): Promise<FormSubmission> {
    const user = await this.findByIdUserService.execute(id);
    if (!user) {
      throw new BadRequestException('User not found!');
    }
    const created = new this.submissionModel({
      formData: createSubmissionDto,
      userId: new Types.ObjectId(id),
    });
    return created.save();
  }
}
