import { Controller, Get, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UpdateUserDto, UserResponseDto } from '../../dto/user.dto';

@Controller('usuarios')
@UseGuards(JwtAuthGuard)
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) {}

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    return this.usuariosService.findAll();
  }

  @Get('me')
  async getMyProfile(@Request() req): Promise<UserResponseDto> {
    return this.usuariosService.getMyProfile(req.user.sub);
  }

  @Put('me')
  async updateMyProfile(@Request() req, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    return this.usuariosService.updateMyProfile(req.user.sub, updateUserDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<UserResponseDto> {
    return this.usuariosService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    return this.usuariosService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.usuariosService.remove(id);
  }
}