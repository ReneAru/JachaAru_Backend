import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../../entities/usuario.entity';
import { LoginDto, RegisterDto } from '../../dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    this.logger.debug(`Registration attempt for email: ${registerDto.mail}`);
    
    const { pass, ...userData } = registerDto;
    
    // Check if user already exists (including soft-deleted users)
    const existingUser = await this.usuarioRepository.findOne({
      where: { mail: registerDto.mail },
      withDeleted: true, // Include soft-deleted users
    });
    
    if (existingUser) {
      // If user exists but is soft-deleted, restore them with new data
      if (existingUser.deletedAt) {
        this.logger.log(`Restoring soft-deleted user: ${registerDto.mail}`);
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(pass, 10);
        
        // Update user with new data and restore
        await this.usuarioRepository.restore(existingUser.id); // Properly restore soft-deleted user
        await this.usuarioRepository.update(existingUser.id, {
          ...userData,
          pass: hashedPassword,
        });
        
        // Fetch the restored user
        const restoredUser = await this.usuarioRepository.findOne({
          where: { id: existingUser.id },
        });
        
        if (!restoredUser) {
          this.logger.error(`Failed to fetch restored user: ${registerDto.mail}`);
          throw new UnauthorizedException('Failed to restore user account');
        }
        
        // Generate JWT token
        const payload = { sub: restoredUser.id, mail: restoredUser.mail };
        const access_token = await this.jwtService.signAsync(payload);

        this.logger.log(`User restored and registered successfully: ${restoredUser.mail} (ID: ${restoredUser.id})`);

        return {
          user: {
            id: restoredUser.id,
            nombres: restoredUser.nombres,
            apellidos: restoredUser.apellidos,
            mail: restoredUser.mail,
          },
          access_token,
        };
      } else {
        // User exists and is active
        this.logger.warn(`Registration failed: Active user already exists for email: ${registerDto.mail}`);
        throw new UnauthorizedException('User with this email already exists');
      }
    }

    // Hash password
    this.logger.debug(`Hashing password for user: ${registerDto.mail}`);
    const hashedPassword = await bcrypt.hash(pass, 10);

    // Create user
    const user = this.usuarioRepository.create({
      ...userData,
      pass: hashedPassword,
    });

    this.logger.debug(`Saving new user to database: ${registerDto.mail}`);
    let savedUser;
    try {
      savedUser = await this.usuarioRepository.save(user);
    } catch (error) {
      this.logger.error(`Database error during registration: ${error.message}`);
      this.logger.debug(`Full error details:`, error);
      
      // Handle unique constraint violation (duplicate email)
      if (error.code === '23505' && error.detail?.includes('mail')) {
        this.logger.warn(`Registration failed: Email already exists (caught by DB): ${registerDto.mail}`);
        throw new UnauthorizedException('User with this email already exists');
      }
      
      // Handle other database errors
      throw new UnauthorizedException('Registration failed due to database error');
    }

    // Generate JWT token
    const payload = { sub: savedUser.id, mail: savedUser.mail };
    const access_token = await this.jwtService.signAsync(payload);

    this.logger.log(`Registration successful for user: ${savedUser.mail} (ID: ${savedUser.id})`);
    this.logger.debug(`Generated token for new user: ${access_token.substring(0, 30)}...`);

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
    this.logger.debug(`Login attempt for email: ${loginDto.mail}`);
    
    // Find user (exclude soft-deleted users)
    const user = await this.usuarioRepository.findOne({
      where: { mail: loginDto.mail },
      // Don't include withDeleted: true here, so soft-deleted users can't login
    });

    if (!user) {
      this.logger.warn(`Login failed: User not found or deleted for email: ${loginDto.mail}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.debug(`User found: ${user.id} - ${user.mail}`);

    const isPasswordValid = await bcrypt.compare(loginDto.pass, user.pass);
    if (!isPasswordValid) {
      this.logger.warn(`Login failed: Invalid password for user: ${user.mail}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { sub: user.id, mail: user.mail };
    const access_token = await this.jwtService.signAsync(payload);

    this.logger.log(`Login successful for user: ${user.mail} (ID: ${user.id})`);
    this.logger.debug(`Generated token: ${access_token.substring(0, 30)}...`);

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