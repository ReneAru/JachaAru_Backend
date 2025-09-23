import { IsNotEmpty, IsNumber, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFiltroDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  categoriaId: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  temaId: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  indicadorId: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  desegregacionId: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  yearId: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  fuenteId: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  fichaMetodologicaId: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  state?: number = 1;
}

export class UpdateFiltroDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  categoriaId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  temaId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  indicadorId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  desegregacionId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  yearId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  fuenteId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  fichaMetodologicaId?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  state?: number;
}