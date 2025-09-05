import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../../entities/usuario.entity';
import { UpdateUserDto, UserResponseDto } from '../../dto/user.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usuarioRepository.find({
      select: ['id', 'nombres', 'apellidos', 'mail', 'createdAt', 'updatedAt'],
    });
    return users;
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.usuarioRepository.findOne({
      where: { id },
      select: ['id', 'nombres', 'apellidos', 'mail', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.usuarioRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.usuarioRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.usuarioRepository.softDelete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async getMyProfile(userId: number): Promise<UserResponseDto> {
    return this.findOne(userId);
  }

  async updateMyProfile(userId: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    return this.update(userId, updateUserDto);
  }
}