import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class LoginDto {
  @IsEmail()
  mail: string;

  @IsString()
  @MinLength(6)
  pass: string;
}

export class RegisterDto {
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

export class AuthResponseDto {
  user: {
    id: number;
    nombres: string;
    apellidos: string;
    mail: string;
  };
  access_token: string;
}