import {
  IsArray,
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
export enum OpcoesAdicionais {
  INSALUBRIDADE = 'Insalubridade',
  PERICULOSIDADE = 'Periculosidade',
  NOTURNO = 'Noturno',
  OUTROS = 'Outros',
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

export enum OutrasModalidadesDispensa {
  RescisaoAntecipada = 'Rescisão Antecipada do Contrato',
  ContratoCooperativa = 'Contrato por cooperativa',
}

export class DadosSalarioBeneficioDto {
  @IsOptional()
  @IsString()
  dataAdmissao?: string;

  @IsNotEmpty()
  @IsEnum(TrabalhouSemRegistroCTPS)
  trabalhouSemRegistroCTPS: TrabalhouSemRegistroCTPS;

  @IsOptional()
  @IsString()
  dataAdmissaoSemRegistro?: string;

  @IsOptional()
  @IsString()
  dataDispensaSemRegistro?: string;

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
  @IsEnum(OpcoesAdicionais)
  @IsString({ each: true })
  adicionais?: OpcoesAdicionais[];

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
