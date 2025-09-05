import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateTemaDto {
  @IsString()
  tema: string;

  @IsNumber()
  categoriaId: number;
}

export class UpdateTemaDto {
  @IsOptional()
  @IsString()
  tema?: string;

  @IsOptional()
  @IsNumber()
  categoriaId?: number;
}