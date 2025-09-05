import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../../entities/usuario.entity';
import { LoginDto, RegisterDto } from '../../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { pass, ...userData } = registerDto;
    
    // Check if user already exists
    const existingUser = await this.usuarioRepository.findOne({
      where: { mail: registerDto.mail },
    });
    
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(pass, 10);

    // Create user
    const user = this.usuarioRepository.create({
      ...userData,
      pass: hashedPassword,
    });

    const savedUser = await this.usuarioRepository.save(user);

    // Generate JWT token
    const payload = { sub: savedUser.id, mail: savedUser.mail };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      user: {
        id: savedUser.id,
        nombres: savedUser.nombres,
        apellidos: savedUser.apellidos,
        mail: savedUser.mail,
      },
      access_token,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usuarioRepository.findOne({
      where: { mail: loginDto.mail },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.pass, user.pass);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { sub: user.id, mail: user.mail };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      user: {
        id: user.id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        mail: user.mail,
      },
      access_token,
    };
  }

  async validateUser(payload: any) {
    return await this.usuarioRepository.findOne({
      where: { id: payload.sub },
    });
  }
}