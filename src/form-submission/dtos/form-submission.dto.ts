import { CondicoesSegurancaTrabalhoDto } from './condicoes-seguranca-trabalho.dto';
import { InformacoesFinaisDto } from './informacoes-finais.dto';
import { DadosJornadaHoraExtraDto } from './jornada-hora-extra.dto';
import { CreateDadosReclamadasDto } from './reclamada.dto';
import { ReclamanteDto } from './reclamante.dto';
import { DadosSalarioBeneficioDto } from './salario-beneficio.dto';

export class CreateFormSubmissionDto {
  reclamante: ReclamanteDto;
  reclamada: CreateDadosReclamadasDto;
  salarioBeneficio: DadosSalarioBeneficioDto;
  jornadaHoraExtra: DadosJornadaHoraExtraDto;
  condicoesSegurancaTrabalho: CondicoesSegurancaTrabalhoDto;
  informacoesFinais: InformacoesFinaisDto;
}
