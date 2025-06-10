import { IsOptional, IsString } from 'class-validator';

export class InformacoesFinaisDto {
  @IsString()
  enderecoUltimoTrabalho: string;

  @IsOptional()
  @IsString()
  informacoesAdicionais?: string;
}
