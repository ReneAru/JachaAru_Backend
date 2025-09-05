import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { IndicadoresService } from './indicadores.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateIndicadorDto, UpdateIndicadorDto } from '../../dto/indicador.dto';
import { Indicador } from '../../entities/indicador.entity';

@Controller('indicadores')
@UseGuards(JwtAuthGuard)
export class IndicadoresController {
  constructor(private indicadoresService: IndicadoresService) {}

  @Get()
  async findAll(@Query('temaId') temaId?: number): Promise<Indicador[]> {
    if (temaId) {
      return this.indicadoresService.findByTema(temaId);
    }
    return this.indicadoresService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Indicador> {
    return this.indicadoresService.findOne(id);
  }

  @Post()
  async create(@Body(ValidationPipe) createIndicadorDto: CreateIndicadorDto): Promise<Indicador> {
    return this.indicadoresService.create(createIndicadorDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number, 
    @Body(ValidationPipe) updateIndicadorDto: UpdateIndicadorDto
  ): Promise<Indicador> {
    return this.indicadoresService.update(id, updateIndicadorDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.indicadoresService.remove(id);
  }
}