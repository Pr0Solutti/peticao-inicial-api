import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { FindByIdFormSubmissionService } from './find-by-id.service';
import { htmlContentDoc } from '../const/htm-content';

@Injectable()
export class AttachmentService {
  constructor(
    readonly findByIdFormSubmissionService: FindByIdFormSubmissionService,
  ) {}
  async execute(id: string) {
    const formSubmission = await this.findByIdFormSubmissionService.execute(id);
    const formData = formSubmission.formData;

    const htmlContent = htmlContentDoc(formData);

    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
      });

      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
      });

      await browser.close();

      return pdfBuffer;
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
  }
}
