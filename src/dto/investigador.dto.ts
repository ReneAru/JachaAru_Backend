import { IsNotEmpty, IsString, IsEmail, IsOptional, IsInt, Min, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInvestigadorDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @IsOptional()
  @IsString()
  telegramId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  state?: number = 1;

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  categoriaIds?: number[];
}

export class UpdateInvestigadorDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsEmail()
  correo?: string;

  @IsOptional()
  @IsString()
  telegramId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  state?: number;

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  categoriaIds?: number[];
}