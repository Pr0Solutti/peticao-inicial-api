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

export enum ResponsabilidadeEmpresa {
  Subsidiaria = 'Subsidiária (terceirizado)',
  Solidaria = 'Solidária (mesmo grupo econômico)',
  Outros = 'Outros',
}

export enum TrabalhouSemRegistroCTPS {
  Sim = 'Sim',
  Nao = 'Não',
  ApenasUmPeriodo = 'Apenas um período',
}

export enum GuiasFGTS {
  Sim = 'Sim',
  Nao = 'Não',
  NaoPossuiTempo = 'Não possui tempo necessário',
  JaEmpregado = 'Não, já está empregado',
}

export enum ModalidadeDispensa {
  Trabalhando = 'Trabalhando',
  RescisaoIndireta = 'Rescisão Indireta',
  PedidoDemissao = 'Pedido de Demissão',
  JustaCausa = 'Justa Causa',
  SemJustaCausa = 'Sem Justa Causa',
  Outros = 'Outros',
}

export enum AvisoPrevio {
  Indenizado = 'Indenizado',
  Trabalhando = 'Trabalhando',
  Outros = 'Outros',
}

export enum OutraFormaAvisoPrevio {
  NaoCumpriu = 'Não cumpriu',
  CumpriuEmCasa = 'Cumpriu em casa',
  Retroativo = 'Retroativo',
  TrabalhadoSemReducao = 'Trabalhado - Sem alternativa de redução da jornada',
}

export enum OpcoesDescontos {
  Ferramentas = 'Ferramentas',
  Materiais = 'Materiais',
  Multa = 'Multa',
  Avaria = 'Avaria/Dano ao veículo',
  Celular = 'Celular',
  Outros = 'Outros',
}

export enum OutrasModalidadesDispensa {
  RescisaoAntecipada = 'Rescisão Antecipada do Contrato',
  ContratoCooperativa = 'Contrato por cooperativa',
}

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
  @IsEnum(ResponsabilidadeEmpresa)
  tipoResposabilidadeEmpresas?: ResponsabilidadeEmpresa;

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
  @IsEnum(TrabalhouSemRegistroCTPS)
  trabalhouSemRegistroCTPS: TrabalhouSemRegistroCTPS;

  @IsOptional()
  @IsString()
  dataAdmissaoSemRegistro?: string;

  @IsOptional()
  @IsBoolean()
  seguroDesempregoSemRegistro?: boolean;

  @IsNotEmpty()
  @IsEnum(ModalidadeDispensa)
  modalidadeDispensa: ModalidadeDispensa;

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
  @IsEnum(AvisoPrevio)
  avisoPrevio?: AvisoPrevio;

  @IsOptional()
  @IsEnum(OutraFormaAvisoPrevio)
  outraFormaAvisoPrevio?: OutraFormaAvisoPrevio;

  @IsOptional()
  @IsBoolean()
  anotacaoCtpsAvisoPrevio?: boolean;

  @IsOptional()
  @IsString()
  dataDispensaAvisoPrevio?: string;

  @IsOptional()
  @IsEnum(OutrasModalidadesDispensa)
  outroTipoDispensa?: OutrasModalidadesDispensa;

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
  @IsEnum(GuiasFGTS)
  guiasFgts?: GuiasFGTS;

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
