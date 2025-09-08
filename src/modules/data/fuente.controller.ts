import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ValidationPipe } from '@nestjs/common';
import { FuenteService } from './fuente.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateFuenteDto, UpdateFuenteDto } from '../../dto/fuente.dto';
import { Fuente } from '../../entities/fuente.entity';

@Controller('fuentes')
@UseGuards(JwtAuthGuard)
export class FuenteController {
  constructor(private fuenteService: FuenteService) {}

  @Get()
  async findAll(): Promise<Fuente[]> {
    return this.fuenteService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Fuente> {
    return this.fuenteService.findOne(id);
  }

  @Post()
  async create(@Body(ValidationPipe) createFuenteDto: CreateFuenteDto): Promise<Fuente> {
    return this.fuenteService.create(createFuenteDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number, 
    @Body(ValidationPipe) updateFuenteDto: UpdateFuenteDto
  ): Promise<Fuente> {
    return this.fuenteService.update(id, updateFuenteDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.fuenteService.remove(id);
  }
}