import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  FormSubmission,
  FormSubmissionDocument,
} from '../schemas/form-submission.schema';
import { CreateFormSubmissionDto } from '../dtos/form-submission.dto';
import { FindByIdUserService } from 'src/user/services/find-by-id.service';

@Injectable()
export class CreateFormSubmissionService {
  constructor(
    @InjectModel(FormSubmission.name)
    private submissionModel: Model<FormSubmissionDocument>,
    private findByIdUserService: FindByIdUserService,
  ) {}

  async create(
    createSubmissionDto: CreateFormSubmissionDto,
  ): Promise<FormSubmission> {
    const user = await this.findByIdUserService.execute(
      createSubmissionDto.userId,
    );
    if (!user) {
      throw new BadRequestException('User not found!');
    }
    const created = new this.submissionModel({
      formData: createSubmissionDto.formData,
      userId: new Types.ObjectId(createSubmissionDto.userId),
    });
    return created.save();
  }
}
