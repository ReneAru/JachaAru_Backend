import { IsString, IsOptional } from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  categoria: string;
}

export class UpdateCategoriaDto {
  @IsOptional()
  @IsString()
  categoria?: string;
}