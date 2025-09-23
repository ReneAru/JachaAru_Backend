import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { FiltrosService } from './filtros.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateFiltroDto, UpdateFiltroDto } from '../../dto/filtro.dto';
import { Filtro } from '../../entities/filtro.entity';

@Controller('filtros')
@UseGuards(JwtAuthGuard)
export class FiltrosController {
  constructor(private filtrosService: FiltrosService) {}

  @Get()
  async findAll(
    @Query('categoriaId') categoriaId?: number,
    @Query('temaId') temaId?: number,
  ): Promise<Filtro[]> {
    if (categoriaId) {
      return this.filtrosService.findByCategoria(Number(categoriaId));
    }
    
    if (temaId) {
      return this.filtrosService.findByTema(Number(temaId));
    }
    
    return this.filtrosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Filtro> {
    return this.filtrosService.findOne(id);
  }

  @Post()
  async create(@Body(ValidationPipe) createFiltroDto: CreateFiltroDto): Promise<Filtro> {
    return this.filtrosService.create(createFiltroDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number, 
    @Body(ValidationPipe) updateFiltroDto: UpdateFiltroDto
  ): Promise<Filtro> {
    return this.filtrosService.update(id, updateFiltroDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.filtrosService.remove(id);
  }
}