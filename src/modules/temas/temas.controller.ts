import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { TemasService } from './temas.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateTemaDto, UpdateTemaDto } from '../../dto/tema.dto';
import { Tema } from '../../entities/tema.entity';

@Controller('temas')
@UseGuards(JwtAuthGuard)
export class TemasController {
  constructor(private temasService: TemasService) {}

  @Get()
  async findAll(@Query('categoriaId') categoriaId?: number): Promise<Tema[]> {
    if (categoriaId) {
      return this.temasService.findByCategoria(categoriaId);
    }
    return this.temasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Tema> {
    return this.temasService.findOne(id);
  }

  @Post()
  async create(@Body(ValidationPipe) createTemaDto: CreateTemaDto): Promise<Tema> {
    return this.temasService.create(createTemaDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number, 
    @Body(ValidationPipe) updateTemaDto: UpdateTemaDto
  ): Promise<Tema> {
    return this.temasService.update(id, updateTemaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.temasService.remove(id);
  }
}