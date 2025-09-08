import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { TipoDesegregacionService, DesegregacionService } from './desegregacion.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateTipoDesegregacionDto, UpdateTipoDesegregacionDto, CreateDesegregacionDto, UpdateDesegregacionDto } from '../../dto/desegregacion.dto';
import { TipoDesegregacion } from '../../entities/tipo-desegregacion.entity';
import { Desegregacion } from '../../entities/desegregacion.entity';

@Controller('tipos-desegregacion')
@UseGuards(JwtAuthGuard)
export class TipoDesegregacionController {
  constructor(private tipoDesegregacionService: TipoDesegregacionService) {}

  @Get()
  async findAll(): Promise<TipoDesegregacion[]> {
    return this.tipoDesegregacionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<TipoDesegregacion> {
    return this.tipoDesegregacionService.findOne(id);
  }

  @Post()
  async create(@Body(ValidationPipe) createTipoDesegregacionDto: CreateTipoDesegregacionDto): Promise<TipoDesegregacion> {
    return this.tipoDesegregacionService.create(createTipoDesegregacionDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number, 
    @Body(ValidationPipe) updateTipoDesegregacionDto: UpdateTipoDesegregacionDto
  ): Promise<TipoDesegregacion> {
    return this.tipoDesegregacionService.update(id, updateTipoDesegregacionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.tipoDesegregacionService.remove(id);
  }
}

@Controller('desegregaciones')
@UseGuards(JwtAuthGuard)
export class DesegregacionController {
  constructor(private desegregacionService: DesegregacionService) {}

  @Get()
  async findAll(@Query('tipoDesegregacionId') tipoDesegregacionId?: number): Promise<Desegregacion[]> {
    if (tipoDesegregacionId) {
      return this.desegregacionService.findByTipo(tipoDesegregacionId);
    }
    return this.desegregacionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Desegregacion> {
    return this.desegregacionService.findOne(id);
  }

  @Post()
  async create(@Body(ValidationPipe) createDesegregacionDto: CreateDesegregacionDto): Promise<Desegregacion> {
    return this.desegregacionService.create(createDesegregacionDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number, 
    @Body(ValidationPipe) updateDesegregacionDto: UpdateDesegregacionDto
  ): Promise<Desegregacion> {
    return this.desegregacionService.update(id, updateDesegregacionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.desegregacionService.remove(id);
  }
}