import { IsString, IsOptional } from 'class-validator';

export class CreateIndicadorDto {
  @IsString()
  indicador: string;
}

export class UpdateIndicadorDto {
  @IsOptional()
  @IsString()
  indicador?: string;
}