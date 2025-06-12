import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
export enum OpcoesDescontos {
  Ferramentas = 'Ferramentas',
  Materiais = 'Materiais',
  Multa = 'Multa',
  Avaria = 'Avaria/Dano ao veículo',
  Celular = 'Celular',
  Outros = 'Outros',
}
export enum Adicional {
  INSALUBRIDADE = 'Insalubridade',
  PERICULOSIDADE = 'Periculosidade',
  NOTURNO = 'Noturno',
  OUTROS = 'Outros',
}
export enum OpcoesAdicionais {
  Insalubridade = 'Insalubridade',
  Periculosidade = 'Periculosidade',
  Noturno = 'Noturno',
  Outros = 'Outros',
}

export enum Riscos {
  ProdutosQuimicos = 'Produtos químicos',
  Poeira = 'Poeira',
  Fumaca = 'Fumaça',
  RiscoBiologico = 'Risco biológico',
  Frio = 'Frio',
  Calor = 'Calor',
}

export enum Frequencia {
  Diariamente = 'Diariamente',
  Semanalmente = 'Semanalmente',
  Mensalmente = 'Mensalmente',
  Semestralmente = 'Semestralmente',
  Anualmente = 'Anualmente',
}

export enum FormaPagamento {
  Dinheiro = 'Dinheiro',
  Pix = 'Pix',
  DepositoConta = 'Deposito na conta',
  Outros = 'Outros',
}

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
  @IsEnum(OpcoesDescontos, { each: true })
  descontosHoleriteSelecionados?: OpcoesDescontos[];

  @IsOptional()
  @IsString()
  outrosDescontosHoleriteSelecionados?: string;

  @IsOptional()
  @IsString()
  valorTotalDescontosHolerite?: string;

  @IsBoolean()
  pagamentoPorFora: boolean;

  @IsOptional()
  @IsEnum(Frequencia)
  frequenciaPorFora?: Frequencia;

  @IsOptional()
  @IsString()
  valorPorFora?: string;

  @IsOptional()
  @IsEnum(FormaPagamento)
  formaPagamentoPorFora?: FormaPagamento;

  @IsOptional()
  @IsString()
  outraFormaPagamentoPorFora?: string;

  @IsOptional()
  @IsBoolean()
  adicionaisRecebidos?: boolean;

  @IsOptional()
  @IsEnum(Adicional)
  @IsString({ each: true })
  adicionais?: Adicional[];

  @IsOptional()
  @IsEnum(Riscos)
  riscoInsalubridade?: Riscos;

  @IsOptional()
  @IsString()
  descricaoAtividadesInsalubridade?: string;

  @IsOptional()
  @IsEnum(Riscos)
  riscoPericulosidade?: Riscos;

  @IsOptional()
  @IsString()
  descricaoAtividadesPericulosidade?: string;

  @IsBoolean()
  tinhaDireitoSemReceber: boolean;

  @IsOptional()
  @IsEnum(OpcoesAdicionais)
  adicionaisDevidos?: OpcoesAdicionais[];

  @IsOptional()
  @IsEnum(Riscos)
  riscoInsalubridadeDevidos?: Riscos;

  @IsOptional()
  @IsString()
  descricaoAtividadesInsalubridadeDevidos?: string;

  @IsOptional()
  @IsEnum(Riscos)
  riscoPericulosidadeDevidos?: Riscos;

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
  @IsEnum(Frequencia)
  frequenciaPremiacao?: Frequencia;

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
