import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { Role } from 'src/auth/decorators/role.decorato';
import { RoleGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRolesEnum } from 'src/user/types/user.types';
import { CreateFormSubmissionDto } from './dtos/form-submission.dto';
import { AttachmentService } from './services/attachment.service';
import { CreateFormSubmissionService } from './services/create.service';
import { FindByIdFormSubmissionService } from './services/find-by-id.service';
import { UpdateFormSubmissionService } from './services/update.service';

@Controller('form-submissions')
export class FormSubmissionController {
  constructor(
    private readonly createFormSubmissionService: CreateFormSubmissionService,
    private readonly attachmentService: AttachmentService,
    private readonly findByIdFormSubmissionService: FindByIdFormSubmissionService,
    private readonly updateFormSubmissionService: UpdateFormSubmissionService,
  ) {}

  @Post()
  @UseGuards(AuthGuard(), RoleGuard)
  @Role(UserRolesEnum.ADMIN, UserRolesEnum.LAWYER)
  async create(
    @Body() createSubmissionDto: CreateFormSubmissionDto,
    @Req() req: { user: { id: string } },
  ) {
    return this.createFormSubmissionService.execute(
      req.user.id,
      createSubmissionDto,
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard(), RoleGuard)
  @Role(UserRolesEnum.ADMIN, UserRolesEnum.LAWYER)
  async findById(@Param('id') id: string) {
    const submission = await this.findByIdFormSubmissionService.execute(id);
    return submission;
  }
  @Post('/attachment/:id')
  @UseGuards(AuthGuard(), RoleGuard)
  @Role(UserRolesEnum.ADMIN, UserRolesEnum.LAWYER)
  async export(@Param('id') id: string, @Res() res: Response) {
    const pdfBuffer = await this.attachmentService.execute(id);
    if (!pdfBuffer) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Erro ao gerar o PDF',
      });
    }
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=documento.pdf',
      'Content-Length': pdfBuffer.length,
    });

    res.status(HttpStatus.OK).send(pdfBuffer);
  }
  @Put(':id')
  @UseGuards(AuthGuard(), RoleGuard)
  @Role(UserRolesEnum.ADMIN, UserRolesEnum.LAWYER)
  async update(
    @Body() updateData: Partial<CreateFormSubmissionDto>,
    @Req() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.updateFormSubmissionService.execute(id, updateData);
  }
}
