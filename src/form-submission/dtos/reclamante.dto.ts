import {
  IsString,
  IsEmail,
  IsOptional,
  Length,
  MinLength,
} from 'class-validator';

export class ReclamanteDto {
  @IsString()
  @MinLength(1, { message: 'Nome é obrigatório' })
  nome: string;

  @IsString()
  @MinLength(1)
  nacionalidade: string;

  @IsString()
  @MinLength(1)
  estadoCivil: string;

  @IsString()
  @MinLength(1)
  rg: string;

  @IsString()
  @IsOptional()
  cpf?: string;

  @IsString()
  @IsOptional()
  pis?: string;

  @IsString()
  @MinLength(1)
  ctpsNumero: string;

  @IsString()
  @MinLength(1)
  serie: string;

  @IsString()
  @MinLength(1)
  nomeMae: string;

  @IsString()
  @MinLength(1)
  dataNascimento: string;

  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsString()
  @MinLength(1)
  telefone: string;

  @IsString()
  @MinLength(1)
  ultiamCidadeTrabalho: string;

  @IsString()
  @MinLength(1)
  rua: string;

  @IsString()
  @MinLength(1)
  bairro: string;

  @IsString()
  @MinLength(1)
  cidade: string;

  @IsString()
  @Length(2, 2)
  uf: string;

  @IsString()
  @MinLength(1)
  cep: string;

  @IsString()
  @MinLength(1)
  numero: string;
}
