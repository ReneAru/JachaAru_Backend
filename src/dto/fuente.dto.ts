import { IsNotEmpty, IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateFuenteDto {
  @IsString()
  @IsNotEmpty()
  fuente: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  state?: number = 1;
}

export class UpdateFuenteDto {
  @IsOptional()
  @IsString()
  fuente?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  state?: number;
}