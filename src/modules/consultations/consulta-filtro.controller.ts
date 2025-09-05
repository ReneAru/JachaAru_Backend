import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ValidationPipe, Request } from '@nestjs/common';
import { ConsultaFiltroService } from './consulta-filtro.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateConsultaFiltroDto, UpdateConsultaFiltroDto } from '../../dto/consulta.dto';
import { ConsultaFiltro } from '../../entities/consulta-filtro.entity';

@Controller('consultations/filtros')
@UseGuards(JwtAuthGuard)
export class ConsultaFiltroController {
  constructor(private consultaFiltroService: ConsultaFiltroService) {}

  @Get()
  async findAll(@Request() req, @Query('userId') userId?: number, @Query('investigadorId') investigadorId?: number): Promise<ConsultaFiltro[]> {
    if (investigadorId) {
      return this.consultaFiltroService.findByInvestigador(investigadorId);
    }
    
    if (userId) {
      return this.consultaFiltroService.findByUser(userId);
    }
    
    // If no filters specified, return user's own consultations
    return this.consultaFiltroService.findByUser(req.user.userId);
  }

  @Get('all')
  async findAllAdmin(): Promise<ConsultaFiltro[]> {
    return this.consultaFiltroService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ConsultaFiltro> {
    return this.consultaFiltroService.findOne(id);
  }

  @Post()
  async create(@Body(ValidationPipe) createConsultaFiltroDto: CreateConsultaFiltroDto): Promise<ConsultaFiltro> {
    return this.consultaFiltroService.create(createConsultaFiltroDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number, 
    @Body(ValidationPipe) updateConsultaFiltroDto: UpdateConsultaFiltroDto
  ): Promise<ConsultaFiltro> {
    return this.consultaFiltroService.update(id, updateConsultaFiltroDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.consultaFiltroService.remove(id);
  }
}