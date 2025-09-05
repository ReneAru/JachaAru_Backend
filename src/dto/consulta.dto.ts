import { IsNotEmpty, IsString, IsNumber, IsDateString, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateConsultaRapidaDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  usuarioId: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  filtroId: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  state?: number = 1;
}

export class UpdateConsultaRapidaDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  usuarioId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  filtroId?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  state?: number;
}

export class CreateConsultaFiltroDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  usuarioId: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  filtroId: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  investigadorId: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  state?: number = 1;
}

export class UpdateConsultaFiltroDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  usuarioId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  filtroId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  investigadorId?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  state?: number;
}

export class CreateConsultaComplejaDto {
  @IsString()
  @IsNotEmpty()
  consulta: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  usuarioId: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  investigadorId: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  state?: number = 1;
}

export class UpdateConsultaComplejaDto {
  @IsOptional()
  @IsString()
  consulta?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  usuarioId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  investigadorId?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  state?: number;
}