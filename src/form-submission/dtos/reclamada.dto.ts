import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

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

export class CreateDadosReclamadasDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReclamadaDto)
  reclamadas: ReclamadaDto[];

  @IsOptional()
  @IsBoolean()
  temMaisReclamadas?: boolean;

  @IsOptional()
  @IsString()
  tipoResposabilidadeEmpresas?: string;

  @IsOptional()
  @IsString()
  dataRegistro?: string;

  @IsOptional()
  @IsString()
  outraResponsabilidadeEmpresa?: string;

  @IsOptional()
  @IsNumber()
  quantasReclamadas?: number;

  @IsNotEmpty()
  @IsString()
  trabalhouSemRegistroCTPS: string;

  @IsOptional()
  @IsString()
  dataAdmissaoSemRegistro?: string;

  @IsOptional()
  @IsBoolean()
  seguroDesempregoSemRegistro?: boolean;

  @IsNotEmpty()
  @IsString()
  modalidadeDispensa: string;

  @IsOptional()
  @IsString()
  motivoModalidadeDispensa?: string;

  @IsOptional()
  @IsBoolean()
  continuarTrabalhando?: boolean;

  @IsOptional()
  @IsBoolean()
  advertenciaSuspensao?: boolean;

  @IsOptional()
  @IsBoolean()
  nulidade?: boolean;

  @IsOptional()
  @IsString()
  advertenciaJustaCausa?: string;

  @IsOptional()
  @IsBoolean()
  teveAnotacaoCtps?: boolean;

  @IsOptional()
  @IsString()
  dataDispensa?: string;

  @IsOptional()
  @IsString()
  avisoPrevio?: string;

  @IsOptional()
  @IsString()
  outraFormaAvisoPrevio?: string;

  @IsOptional()
  @IsBoolean()
  anotacaoCtpsAvisoPrevio?: boolean;

  @IsOptional()
  @IsString()
  dataDispensaAvisoPrevio?: string;

  @IsOptional()
  @IsString()
  outroTipoDispensa?: string;

  @IsOptional()
  @IsString()
  valorRescisao?: string;

  @IsOptional()
  @IsBoolean()
  descontoIndevido?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  descontosSelecionados?: string[];

  @IsOptional()
  @IsString()
  valorTotalDescontos?: string;

  @IsOptional()
  @IsString()
  guiasFgts?: string;

  @IsOptional()
  @IsBoolean()
  prazoRescisao?: boolean;

  @IsBoolean()
  fgtsCorreto: boolean;

  @IsOptional()
  @IsString()
  periodoFgts?: string;

  @IsOptional()
  @IsBoolean()
  acordoEmpresa?: boolean;

  @IsOptional()
  @IsString()
  valorAcordo?: string;
}
