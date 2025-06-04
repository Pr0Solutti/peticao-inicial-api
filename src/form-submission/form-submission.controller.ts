import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';

import { CreateFormSubmissionService } from './services/create.service';
import { CreateFormSubmissionDto } from './dtos/form-submission.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/auth/decorators/role.decorato';
import { UserRolesEnum } from 'src/user/types/user.types';
import { AttachmentService } from './services/attachment.service';
import { FormData } from './interface/form-data';
import { Response } from 'express';

@Controller('form-submissions')
export class FormSubmissionController {
  constructor(
    private readonly createFormSubmissionService: CreateFormSubmissionService,
    private readonly attachmentService: AttachmentService,
  ) {}

  @Post()
  @UseGuards(AuthGuard(), RoleGuard)
  @Role(UserRolesEnum.ADMIN, UserRolesEnum.LAWYER)
  async create(@Body() createSubmissionDto: CreateFormSubmissionDto) {
    return this.createFormSubmissionService.create(createSubmissionDto);
  }
  @Post('/attachment')
  @UseGuards(AuthGuard(), RoleGuard)
  @Role(UserRolesEnum.ADMIN, UserRolesEnum.LAWYER)
  async export(@Body() createSubmissionDto: FormData, @Res() res: Response) {
    const pdfBuffer = await this.attachmentService.execute(createSubmissionDto);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=documento.pdf',
      'Content-Length': pdfBuffer.length,
    });

    res.status(HttpStatus.OK).send(pdfBuffer);
  }
}
