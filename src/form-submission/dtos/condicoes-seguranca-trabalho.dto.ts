import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CondicoesSegurancaTrabalhoDto {
  @IsBoolean()
  acidenteTrabalho: boolean;

  @IsOptional()
  @IsString()
  dataAcidente?: string;

  @IsOptional()
  @IsString()
  dataAltaAcidente?: string;

  @IsOptional()
  @IsString()
  descricaoAcidente?: string;

  @IsOptional()
  @IsBoolean()
  afastamentoInssAcidente?: boolean;

  @IsOptional()
  @IsString()
  periodoAfastamentoAcidente?: string;

  @IsOptional()
  @IsBoolean()
  nexoAcidente?: boolean;

  @IsOptional()
  @IsBoolean()
  catEmitida?: boolean;

  @IsOptional()
  @IsBoolean()
  laudosAcidente?: boolean;

  @IsBoolean()
  doencaTrabalho: boolean;

  @IsOptional()
  @IsString()
  descricaoDoenca?: string;

  @IsOptional()
  @IsBoolean()
  afastamentoInssDoenca?: boolean;

  @IsOptional()
  @IsString()
  periodoAfastamentoDoenca?: string;

  @IsOptional()
  @IsBoolean()
  laudosDoenca?: boolean;

  @IsOptional()
  @IsBoolean()
  problemaSaudeDispensa?: boolean;

  @IsOptional()
  @IsString()
  doencaEmTratamento?: string;

  @IsOptional()
  @IsString()
  periodoTratamento?: string;

  @IsOptional()
  @IsBoolean()
  empresaOfereceuConvenio?: boolean;

  @IsOptional()
  @IsBoolean()
  aderiuConvenio?: boolean;

  @IsOptional()
  @IsBoolean()
  utilizavaConvenio?: boolean;

  @IsOptional()
  @IsBoolean()
  manterConvenioAposDispensa?: boolean;

  @IsOptional()
  @IsBoolean()
  laudosTratamento?: boolean;

  @IsOptional()
  @IsBoolean()
  assedioMoral?: boolean;

  @IsOptional()
  @IsString()
  descricaoAssedio?: string;

  @IsOptional()
  @IsBoolean()
  temTestemunhaAssedio?: boolean;

  @IsOptional()
  @IsBoolean()
  temProvasAssedio?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  condicoes?: string[];

  @IsBoolean()
  trabalhouOutroEstado: boolean;

  @IsOptional()
  @IsBoolean()
  recebeuAdicionalTransferencia?: boolean;

  @IsOptional()
  @IsString()
  cidadeTransferencia?: string;

  @IsOptional()
  @IsString()
  tempoTransferencia?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  beneficios?: string[];

  @IsOptional()
  @IsString()
  valorRecebidoAlimentacao?: string;

  @IsOptional()
  @IsString()
  valorDevidoAlimentacao?: string;

  @IsOptional()
  @IsString()
  valorDevidoTransporte?: string;

  @IsOptional()
  @IsString()
  valorRecebidoTransporte?: string;

  @IsOptional()
  @IsString()
  valorDevidoPLRPPR?: string;

  @IsOptional()
  @IsString()
  valorRecebidoPLRPPR?: string;

  @IsOptional()
  @IsString()
  descricaoBeneficioOutros?: string;

  @IsOptional()
  @IsString()
  valorDevidoOutros?: string;

  @IsOptional()
  @IsString()
  valorRecebidoOutros?: string;

  @IsOptional()
  @IsBoolean()
  temFilhoMenor?: boolean;

  @IsOptional()
  @IsBoolean()
  recebiaSalarioFamilia?: boolean;

  @IsOptional()
  @IsString()
  quantidadeFilhos?: string;

  @IsOptional()
  @IsBoolean()
  salarioInferiorLimite?: boolean;

  @IsOptional()
  @IsBoolean()
  usavaVeiculoProprio?: boolean;

  @IsOptional()
  @IsBoolean()
  recebiaAluguelVeiculo?: boolean;

  @IsOptional()
  @IsString()
  valorAluguelVeiculo?: string;

  @IsOptional()
  @IsBoolean()
  prometeramPagamentoVeiculo?: boolean;

  @IsOptional()
  @IsString()
  valorPrometidoVeiculo?: string;

  @IsOptional()
  @IsString()
  descricaoVeiculo?: string;

  @IsOptional()
  @IsBoolean()
  usavaVeiculoEmpresa?: boolean;

  @IsOptional()
  @IsBoolean()
  tinhaGaragem?: boolean;

  @IsOptional()
  @IsString()
  valorAluguelGaragem?: string;

  @IsOptional()
  @IsBoolean()
  empresaPagavaGaragem?: boolean;

  @IsOptional()
  @IsString()
  valorPagoEmpresaGaragem?: string;

  @IsOptional()
  @IsBoolean()
  empresaPagavaCombustivel?: boolean;

  @IsOptional()
  @IsString()
  valorCombustivelEmpresa?: string;

  @IsOptional()
  @IsString()
  valorGastoReclamante?: string;
}
