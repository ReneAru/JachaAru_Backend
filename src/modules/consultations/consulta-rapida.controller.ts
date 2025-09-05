import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ValidationPipe, Request } from '@nestjs/common';
import { ConsultaRapidaService } from './consulta-rapida.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateConsultaRapidaDto, UpdateConsultaRapidaDto } from '../../dto/consulta.dto';
import { ConsultaRapida } from '../../entities/consulta-rapida.entity';

@Controller('consultations/rapidas')
@UseGuards(JwtAuthGuard)
export class ConsultaRapidaController {
  constructor(private consultaRapidaService: ConsultaRapidaService) {}

  @Get()
  async findAll(@Request() req, @Query('userId') userId?: number): Promise<ConsultaRapida[]> {
    if (userId) {
      return this.consultaRapidaService.findByUser(userId);
    }
    
    // If no userId specified, return user's own consultations
    return this.consultaRapidaService.findByUser(req.user.userId);
  }

  @Get('all')
  async findAllAdmin(): Promise<ConsultaRapida[]> {
    return this.consultaRapidaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ConsultaRapida> {
    return this.consultaRapidaService.findOne(id);
  }

  @Post()
  async create(@Body(ValidationPipe) createConsultaRapidaDto: CreateConsultaRapidaDto): Promise<ConsultaRapida> {
    return this.consultaRapidaService.create(createConsultaRapidaDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number, 
    @Body(ValidationPipe) updateConsultaRapidaDto: UpdateConsultaRapidaDto
  ): Promise<ConsultaRapida> {
    return this.consultaRapidaService.update(id, updateConsultaRapidaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.consultaRapidaService.remove(id);
  }
}