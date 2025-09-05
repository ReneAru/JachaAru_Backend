import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  nombres: string;

  @IsString()
  apellidos: string;

  @IsEmail()
  mail: string;

  @IsString()
  @MinLength(6)
  pass: string;

  @IsOptional()
  @IsString()
  googleId?: string;

  @IsOptional()
  @IsString()
  telegramId?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  nombres?: string;

  @IsOptional()
  @IsString()
  apellidos?: string;

  @IsOptional()
  @IsEmail()
  mail?: string;

  @IsOptional()
  @IsString()
  googleId?: string;

  @IsOptional()
  @IsString()
  telegramId?: string;
}

export class UserResponseDto {
  id: number;
  nombres: string;
  apellidos: string;
  mail: string;
  createdAt: Date;
  updatedAt: Date;
}