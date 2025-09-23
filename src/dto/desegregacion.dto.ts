import { IsNotEmpty, IsString, IsNumber, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTipoDesegregacionDto {
  @IsString()
  @IsNotEmpty()
  tipoDesg: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  state?: number = 1;
}

export class UpdateTipoDesegregacionDto {
  @IsOptional()
  @IsString()
  tipoDesg?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  state?: number;
}

export class CreateDesegregacionDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  tipoDesegregacionId: number;

  @IsString()
  @IsNotEmpty()
  desagregacion: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  state?: number = 1;
}

export class UpdateDesegregacionDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  tipoDesegregacionId?: number;

  @IsOptional()
  @IsString()
  desagregacion?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  state?: number;
}