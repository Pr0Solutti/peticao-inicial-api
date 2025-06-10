import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class DadosSalarioBeneficioDto {
  @IsBoolean()
  feriasVencidas: boolean;

  @IsString()
  @IsNotEmpty()
  cargoCtps: string;

  @IsString()
  @IsNotEmpty()
  atividadesDesempenhadas: string;

  @IsBoolean()
  desvioFuncao: boolean;

  @IsOptional()
  @IsString()
  cargoDesempenhado?: string;

  @IsOptional()
  @IsString()
  atividadesDesvio?: string;

  @IsString()
  @IsNotEmpty()
  ultimoSalario: string;

  @IsBoolean()
  salarioMenorMinimo: boolean;

  @IsBoolean()
  salarioMenorPiso: boolean;

  @IsOptional()
  @IsString()
  outroAdicional?: string;

  @IsBoolean()
  salarioAtrasado: boolean;

  @IsOptional()
  @IsString()
  mesAtraso?: string;

  @IsOptional()
  @IsBoolean()
  descontoHolerite?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  descontosHoleriteSelecionados?: string[];

  @IsOptional()
  @IsString()
  outrosDescontosHoleriteSelecionados?: string;

  @IsOptional()
  @IsString()
  valorTotalDescontosHolerite?: string;

  @IsBoolean()
  pagamentoPorFora: boolean;

  @IsOptional()
  @IsString()
  frequenciaPorFora?: string;

  @IsOptional()
  @IsString()
  valorPorFora?: string;

  @IsOptional()
  @IsString()
  formaPagamentoPorFora?: string;

  @IsOptional()
  @IsString()
  outraFormaPagamentoPorFora?: string;

  @IsOptional()
  @IsBoolean()
  adicionaisRecebidos?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  adicionais?: string[];

  @IsOptional()
  @IsString()
  riscoInsalubridade?: string;

  @IsOptional()
  @IsString()
  descricaoAtividadesInsalubridade?: string;

  @IsOptional()
  @IsString()
  riscoPericulosidade?: string;

  @IsOptional()
  @IsString()
  descricaoAtividadesPericulosidade?: string;

  @IsBoolean()
  tinhaDireitoSemReceber: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  adicionaisDevidos?: string[];

  @IsOptional()
  @IsString()
  riscoInsalubridadeDevidos?: string;

  @IsOptional()
  @IsString()
  descricaoAtividadesInsalubridadeDevidos?: string;

  @IsOptional()
  @IsString()
  riscoPericulosidadeDevidos?: string;

  @IsOptional()
  @IsString()
  descricaoAtividadesPericulosidadeDevidos?: string;

  @IsBoolean()
  equiparacaoSalarial: boolean;

  @IsOptional()
  @IsString()
  nomeParadigma?: string;

  @IsOptional()
  @IsString()
  cargoParadigma?: string;

  @IsOptional()
  @IsString()
  dataAdmissaoParadigma?: string;

  @IsOptional()
  @IsString()
  salarioParadigma?: string;

  @IsOptional()
  @IsString()
  periodoMesmaFuncao?: string;

  @IsBoolean()
  salarioSubstituicao: boolean;

  @IsOptional()
  @IsString()
  nomeSubstituido?: string;

  @IsOptional()
  @IsString()
  cargoSubstituido?: string;

  @IsOptional()
  @IsString()
  dataAdmissaoSubstituido?: string;

  @IsOptional()
  @IsString()
  salarioSubstituido?: string;

  @IsOptional()
  @IsString()
  periodoSubstituicao?: string;

  @IsOptional()
  @IsString()
  motivoSubstituicao?: string;

  @IsOptional()
  @IsBoolean()
  recebiaPremiacao?: boolean;

  @IsOptional()
  @IsString()
  valorMedioPremiacao?: string;

  @IsOptional()
  @IsString()
  frequenciaPremiacao?: string;

  @IsOptional()
  @IsString()
  descricaoPremiacao?: string;

  @IsBoolean()
  promessaPremiacao: boolean;

  @IsOptional()
  @IsString()
  descricaoPromessaPremiacao?: string;

  @IsOptional()
  @IsString()
  outroAdicionalDevidos?: string;

  @IsOptional()
  @IsString()
  valorMinMaxPremiacao?: string;
}
