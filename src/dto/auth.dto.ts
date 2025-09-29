import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com'
  })
  @IsEmail()
  mail: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'password123',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  pass: string;
}

export class RegisterDto {
  @ApiProperty({
    description: 'First name(s)',
    example: 'John'
  })
  @IsString()
  nombres: string;

  @ApiProperty({
    description: 'Last name(s)',
    example: 'Doe'
  })
  @IsString()
  apellidos: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com'
  })
  @IsEmail()
  mail: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'password123',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  pass: string;

  @ApiPropertyOptional({
    description: 'Google account ID for OAuth integration',
    example: '1234567890'
  })
  @IsOptional()
  @IsString()
  googleId?: string;

  @ApiPropertyOptional({
    description: 'Telegram account ID for notifications',
    example: '@johndoe'
  })
  @IsOptional()
  @IsString()
  telegramId?: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'User information',
    example: {
      id: 1,
      nombres: 'John',
      apellidos: 'Doe',
      mail: 'john.doe@example.com'
    }
  })
  user: {
    id: number;
    nombres: string;
    apellidos: string;
    mail: string;
  };

  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsIm1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsImlhdCI6MTYzMjE2MjAwMCwiZXhwIjoxNjMyNzY2ODAwfQ.abc123...'
  })
  access_token: string;
}