import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DadosJornadaHoraExtraDto {
  @IsString()
  @IsNotEmpty({ message: 'A jornada real é obrigatória.' })
  jornadaReal: string;

  @IsOptional()
  @IsString()
  jornadaOutroTexto?: string;

  @IsString()
  @IsNotEmpty({ message: 'O número de sábados por mês é obrigatório.' })
  sabadosPorMes: string;

  @IsString()
  @IsNotEmpty({ message: 'O número de domingos por mês é obrigatório.' })
  domingosPorMes: string;

  @IsString()
  @IsNotEmpty({ message: 'Informe se trabalhava em feriados.' })
  trabalhavaFeriados: string;

  @IsString()
  @IsNotEmpty({ message: 'Informe se trabalhava no Natal e Ano Novo.' })
  natalAnoNovo: string;

  @IsString()
  @IsNotEmpty({ message: 'O horário de trabalho é obrigatório.' })
  horarioTrabalho: string;

  @IsString()
  @IsNotEmpty({ message: 'O intervalo efetivo é obrigatório.' })
  intervaloEfetivo: string;

  @IsOptional()
  @IsString()
  intervaloContrato?: string;

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
  @IsString()
  frequenciaSobreaviso?: string;

  @IsOptional()
  @IsString()
  horariosSobreaviso?: string;

  @IsOptional()
  @IsString()
  frequenciaAcionamento?: string;

  @IsOptional()
  @IsString()
  horasAcionamento?: string;

  @IsBoolean()
  turnoRevezamento: boolean;

  @IsBoolean()
  saidaAntecipada: boolean;

  @IsOptional()
  @IsString()
  motivoSaidaAntecipada?: string;

  @IsString()
  @IsNotEmpty({ message: 'O controle horário é obrigatório.' })
  controleHorario: string;

  @IsOptional()
  @IsString()
  controleHorarioOutro?: string;
}
