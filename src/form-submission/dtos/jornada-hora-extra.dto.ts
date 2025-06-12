import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
export enum OpcoesJornada {
  SegundaADomingo = 'Segunda-feira a domingo',
  SegundaASabado = 'Segunda-feira a sábado',
  SegundaASexta = 'Segunda-feira a sexta-feira',
  DozePorTrintaSeis = '12x36',
  SeisPorUm = '6x1',
  CincoPorUm = '5x1',
  CincoPorDois = '5x2',
  SeisPorDois = '6x2',
  QuatroPorDoisVariacoes = '4x2 / 4x3 / 4x2',
  Outros = 'Outros',
}

export enum SabadosTrabalhados {
  Um = '1',
  Dois = '2',
  Tres = '3',
  Todos = 'Todos',
}

export enum SimNaoAlternados {
  Sim = 'Sim',
  Nao = 'Não',
  Alternados = 'Alternados',
}

export enum Intervalo {
  DezMin = '10 minutos',
  VinteMin = '20 minutos',
  TrintaMin = '30 minutos',
  QuarentaMin = '40 minutos',
  CinquentaMin = '50 minutos',
  UmaHora = '1 hora completa',
  UmaHoraTrinta = '1 hora e 30 minutos',
  NaoFazia = 'Não fazia',
}

export enum IntervaloPrevistoContrato {
  DezVinteDez = '10/20/10 minutos',
  QuinzeMin = '15 minutos',
  UmaHora = '1 hora',
  UmaHoraTrinta = '1 hora e 30 minutos',
}

export enum FrequenciaSemanal {
  Selecione = 'Selecione',
  UmaADuas = '1 a 2 vezes por semana',
  DuasATres = '2 a 3 vezes por semana',
  TresAQuatro = '3 a 4 vezes por semana',
  TodosOsDias = 'Todos os dias',
}

export enum HorasAcionado {
  UmADois = '1 a 2 horas por dia acionado',
  TresAQuatro = '3 a 4 horas por dia acionado',
  CincoASeis = '5 a 6 horas por dia acionado',
  SeteAOito = '7 a 8 horas por dia acionado',
}

export enum ControleHorario {
  CartaoDePonto = 'Cartão de Ponto',
  Livro = 'Livro',
  PontoEletronico = 'Ponto Eletrônico',
  AplicativoPDA = 'Aplicativo/PDA',
  PontoBiometrico = 'Ponto Biométrico',
  Outros = 'Outros',
}

export class DadosJornadaHoraExtraDto {
  @IsString()
  @IsNotEmpty({ message: 'A jornada real é obrigatória.' })
  jornadaReal: string;

  @IsOptional()
  @IsEnum(OpcoesJornada)
  jornadaOutroTexto?: OpcoesJornada;

  @IsEnum(SabadosTrabalhados)
  @IsNotEmpty({ message: 'O número de sábados por mês é obrigatório.' })
  sabadosPorMes: SabadosTrabalhados;

  @IsEnum(SabadosTrabalhados)
  @IsNotEmpty({ message: 'O número de domingos por mês é obrigatório.' })
  domingosPorMes: SabadosTrabalhados;

  @IsEnum(SimNaoAlternados)
  @IsNotEmpty({ message: 'Informe se trabalhava em feriados.' })
  trabalhavaFeriados: SimNaoAlternados;

  @IsEnum(SimNaoAlternados)
  @IsNotEmpty({ message: 'Informe se trabalhava no Natal e Ano Novo.' })
  natalAnoNovo: SimNaoAlternados;

  @IsString()
  @IsNotEmpty({ message: 'O horário de trabalho é obrigatório.' })
  horarioTrabalho: string;

  @IsEnum(Intervalo)
  @IsNotEmpty({ message: 'O intervalo efetivo é obrigatório.' })
  intervaloEfetivo: Intervalo;

  @IsOptional()
  @IsEnum(IntervaloPrevistoContrato)
  intervaloContrato?: IntervaloPrevistoContrato;

  @IsOptional()
  @IsString()
  outroAdicional?: string;

  @IsOptional()
  @IsString()
  outroAdicionalDevidos?: string;

  @IsOptional()
  @IsString()
  valorMinMaxPremiacao?: string;

  @IsBoolean()
  sobreaviso: boolean;

  @IsOptional()
  @IsEnum(FrequenciaSemanal)
  frequenciaSobreaviso?: FrequenciaSemanal;

  @IsOptional()
  @IsString()
  horariosSobreaviso?: string;

  @IsOptional()
  @IsEnum(FrequenciaSemanal)
  frequenciaAcionamento?: FrequenciaSemanal;

  @IsOptional()
  @IsEnum(HorasAcionado)
  horasAcionamento?: HorasAcionado;

  @IsBoolean()
  turnoRevezamento: boolean;

  @IsBoolean()
  saidaAntecipada: boolean;

  @IsOptional()
  @IsString()
  motivoSaidaAntecipada?: string;

  @IsEnum(ControleHorario)
  @IsNotEmpty({ message: 'O controle horário é obrigatório.' })
  controleHorario: ControleHorario;

  @IsOptional()
  @IsString()
  controleHorarioOutro?: string;
}
