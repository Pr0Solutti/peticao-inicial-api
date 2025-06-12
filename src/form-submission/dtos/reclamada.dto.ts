import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

class ReclamadaDto {
  @IsNotEmpty()
  nome: string;

  @IsOptional()
  cnpj?: string;

  @IsNotEmpty()
  rua: string;

  @IsNotEmpty()
  numero: string;

  @IsNotEmpty()
  bairro: string;

  @IsNotEmpty()
  cidade: string;

  @Length(2, 2)
  uf: string;

  @IsNotEmpty()
  cep: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  telefone: string;
}
export enum ResponsabilidadeEmpresa {
  Subsidiaria = 'Subsidiária (terceirizado)',
  Solidaria = 'Solidária (mesmo grupo econômico)',
  Outros = 'Outros',
}
export class CreateDadosReclamadasDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReclamadaDto)
  reclamadas: ReclamadaDto[];

  @IsOptional()
  @IsBoolean()
  temMaisReclamadas?: boolean;

  @IsOptional()
  @IsEnum(ResponsabilidadeEmpresa)
  tipoResposabilidadeEmpresas?: ResponsabilidadeEmpresa;

  @IsOptional()
  @IsString()
  outraResponsabilidadeEmpresa?: string;

  @IsOptional()
  @IsNumber()
  quantasReclamadas?: number;
}
