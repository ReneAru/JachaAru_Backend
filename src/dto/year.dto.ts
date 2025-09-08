import { IsNotEmpty, IsInt, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateYearDto {
  @IsInt()
  @IsNotEmpty()
  @Min(1900)
  @Max(2100)
  @Type(() => Number)
  year: number;
}

export class UpdateYearDto {
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  @Type(() => Number)
  year?: number;
}