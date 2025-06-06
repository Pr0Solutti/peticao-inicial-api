import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FormDataDocument = FormData & Document;

@Schema({ timestamps: true, _id: false })
export class Reclamada {
  @Prop()
  nome: string;

  @Prop()
  cnpj: string;
  @Prop()
  endereco: string;
  @Prop()
  bairro: string;
  @Prop()
  cidade: string;
  @Prop()
  uf: string;
  @Prop()
  cep: string;
  @Prop()
  email: string;
  @Prop()
  telefone: string;
}

const ReclamadaSchema = SchemaFactory.createForClass(Reclamada);

@Schema({ timestamps: false, _id: false })
export class FormData {
  @Prop() nomeReclamante: string;
  @Prop() nacionalidadeReclamante: string;
  @Prop() estadoCivilReclamante: string;
  @Prop() rgReclamante: string;
  @Prop() cpfReclamante: string;
  @Prop() pisReclamante: string;
  @Prop() ctpsNumeroReclamante: string;
  @Prop() ctpsSerieReclamante: string;
  @Prop() nomeMaeReclamante: string;
  @Prop() dataNascimentoReclamante: string;
  @Prop() enderecoReclamante: string;
  @Prop() bairroReclamante: string;
  @Prop() cidadeReclamante: string;
  @Prop() ufReclamante: string;
  @Prop() cepReclamante: string;
  @Prop() emailReclamante: string;
  @Prop({ type: [ReclamadaSchema] })
  reclamadas: Reclamada[];
  @Prop() cidade: string;
  @Prop() temMaisReclamadas: string;
  @Prop() quantasReclamadas: number;
  @Prop() modalidadeDispensa: string;
  @Prop() motivoRescisaoIndireta: string;
  @Prop() continuarTrabalhando: string;
  @Prop() motivoPedidoDemissao: string;
  @Prop() advertenciaPedido: string;
  @Prop() nulidadePedido: string;
  @Prop() motivoJustaCausa: string;
  @Prop() advertenciaJustaCausa: string;
  @Prop() nulidadeJustaCausa: string;
  @Prop() teveAnotacaoCtps: string;
  @Prop() dataDispensa: string;
  @Prop() avisoPrevio: string;
  @Prop() descricaoAvisoPrevio: string;
  @Prop() anotacaoCtpsAvisoPrevio: string;
  @Prop() dataDispensaAvisoPrevio: string;
  @Prop() outroTipoDispensa: string;

  // STEP 2
  @Prop() valorRescisao: string;
  @Prop() prazoRescisao: string;
  @Prop() descontoIndevido: string;
  @Prop({ type: [String] }) descontosSelecionados: string[];
  @Prop() outrosDescontosSelecionados: string;
  @Prop() valorTotalDescontos: string;
  @Prop() guiasFgts: string;
  @Prop() fgtsCorreto: string;
  @Prop() periodoFgts: string;
  @Prop() acordoEmpresa: string;
  @Prop() valorAcordo: string;
  @Prop() feriasVencidas: string;
  @Prop() cargoCtps: string;
  @Prop() atividadesDesempenhadas: string;
  @Prop() desvioFuncao: string;
  @Prop() cargoDesempenhado: string;
  @Prop() atividadesDesvio: string;
  @Prop() ultimoSalario: string;
  @Prop() salarioMenorMinimo: string;
  @Prop() salarioMenorPiso: string;
  @Prop() salarioAtrasado: string;
  @Prop() mesAtraso: string;
  @Prop() descontoHolerite: string;
  @Prop({ type: [String] }) descontosHoleriteSelecionados: string[];
  @Prop() outrosDescontosHoleriteSelecionados: string;
  @Prop() valorTotalDescontosHolerite: string;
  @Prop() pagamentoPorFora: string;
  @Prop() frequenciaPorFora: string;
  @Prop() valorPorFora: string;
  @Prop() formaPagamentoPorFora: string;
  @Prop() outraFormaPagamentoPorFora: string;
  @Prop() adicionaisRecebidos: string;
  @Prop({ type: [String] }) adicionais: string[];
  @Prop() riscoInsalubridade: string;
  @Prop() descricaoAtividadesInsalubridade: string;
  @Prop() riscoPericulosidade: string;
  @Prop() descricaoAtividadesPericulosidade: string;
  @Prop() tinhaDireitoSemReceber: string;
  @Prop({ type: [String] }) adicionaisDevidos: string[];
  @Prop() riscoInsalubridadeDevidos: string;
  @Prop() descricaoAtividadesInsalubridadeDevidos: string;
  @Prop() riscoPericulosidadeDevidos: string;
  @Prop() descricaoAtividadesPericulosidadeDevidos: string;
  @Prop() equiparacaoSalarial: string;
  @Prop() nomeParadigma: string;
  @Prop() cargoParadigma: string;
  @Prop() dataAdmissaoParadigma: string;
  @Prop() salarioParadigma: string;
  @Prop() periodoMesmaFuncao: string;
  @Prop() salarioSubstituicao: string;
  @Prop() nomeSubstituido: string;
  @Prop() cargoSubstituido: string;
  @Prop() dataAdmissaoSubstituido: string;
  @Prop() salarioSubstituido: string;
  @Prop() periodoSubstituicao: string;
  @Prop() motivoSubstituicao: string;
  @Prop() recebiaPremiacao: string;
  @Prop() valorMedioPremiacao: string;
  @Prop() frequenciaPremiacao: string;
  @Prop() descricaoPremiacao: string;
  @Prop() promessaPremiacao: string;
  @Prop() descricaoPromessaPremiacao: string;
  @Prop() jornadaReal: string;
  @Prop() jornadaOutroTexto: string;
  @Prop() sabadosPorMes: string;
  @Prop() domingosPorMes: string;
  @Prop() trabalhavaFeriados: string;
  @Prop() natalAnoNovo: string;
  @Prop() horarioTrabalho: string;
  @Prop() intervaloEfetivo: string;
  @Prop() intervaloContrato: string;
  @Prop() outroAdicional: string;
  @Prop() outroAdicionalDevidos: string;
  @Prop() valorMinMaxPremiacao: string;

  // STEP 3
  @Prop() sobreaviso: string;
  @Prop() frequenciaSobreaviso: string;
  @Prop() horariosSobreaviso: string;
  @Prop() frequenciaAcionamento: string;
  @Prop() horasAcionamento: string;
  @Prop() turnoRevezamento: string;
  @Prop() saidaAntecipada: string;
  @Prop() motivoSaidaAntecipada: string;
  @Prop() controleHorario: string;
  @Prop() controleHorarioOutro: string;
  @Prop() acidenteTrabalho: string;
  @Prop() dataAcidente: string;
  @Prop() descricaoAcidente: string;
  @Prop() afastamentoInssAcidente: string;
  @Prop() periodoAfastamentoAcidente: string;
  @Prop() nexoAcidente: string;
  @Prop() catEmitida: string;
  @Prop() laudosAcidente: string;
  @Prop() doencaTrabalho: string;
  @Prop() descricaoDoenca: string;
  @Prop() afastamentoInssDoenca: string;
  @Prop() periodoAfastamentoDoenca: string;
  @Prop() laudosDoenca: string;
  @Prop() problemaSaudeDispensa: string;
  @Prop() doencaEmTratamento: string;
  @Prop() periodoTratamento: string;
  @Prop() empresaOfereceuConvenio: string;
  @Prop() aderiuConvenio: string;
  @Prop() utilizavaConvenio: string;
  @Prop() manterConvenioAposDispensa: string;
  @Prop() laudosTratamento: string;
  @Prop() assedioMoral: string;
  @Prop() descricaoAssedio: string;
  @Prop() temTestemunhaAssedio: string;
  @Prop() temProvasAssedio: string;
  @Prop({ type: [String] }) condicoes: string[];
  @Prop() trabalhouOutroEstado: string;
  @Prop() recebeuAdicionalTransferencia: string;
  @Prop() cidadeTransferencia: string;
  @Prop() tempoTransferencia: string;
  @Prop({ type: [String] }) beneficios: string[];
  @Prop() valorRecebidoAlimentacao: string;
  @Prop() valorDevidoAlimentacao: string;
  @Prop() valorDevidoTransporte: string;
  @Prop() valorRecebidoTransporte: string;
  @Prop() valorDevidoPLRPPR: string;
  @Prop() valorRecebidoPLRPPR: string;
  @Prop() descricaoBeneficioOutros: string;
  @Prop() valorDevidoOutros: string;
  @Prop() valorRecebidoOutros: string;
  @Prop() temFilhoMenor: string;
  @Prop() recebiaSalarioFamilia: string;
  @Prop() quantidadeFilhos: string;
  @Prop() salarioInferiorLimite: string;
  @Prop() usavaVeiculoProprio: string;
  @Prop() recebiaAluguelVeiculo: string;
  @Prop() valorAluguelVeiculo: string;
  @Prop() prometeramPagamentoVeiculo: string;
  @Prop() valorPrometidoVeiculo: string;
  @Prop() descricaoVeiculo: string;
  @Prop() usavaVeiculoEmpresa: string;
  @Prop() tinhaGaragem: string;
  @Prop() valorAluguelGaragem: string;
  @Prop() empresaPagavaGaragem: string;
  @Prop() valorPagoEmpresaGaragem: string;
  @Prop() empresaPagavaCombustivel: string;
  @Prop() valorCombustivelEmpresa: string;
  @Prop() valorGastoReclamante: string;

  // STEP 4
  @Prop() enderecoUltimoTrabalho: string;
  @Prop() informacoesAdicionais: string;
}

export const FormDataSchema = SchemaFactory.createForClass(FormData);
