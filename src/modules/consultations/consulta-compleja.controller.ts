import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ValidationPipe, Request } from '@nestjs/common';
import { ConsultaComplejaService } from './consulta-compleja.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateConsultaComplejaDto, UpdateConsultaComplejaDto } from '../../dto/consulta.dto';
import { ConsultaCompleja } from '../../entities/consulta-compleja.entity';

@Controller('consultations/complejas')
@UseGuards(JwtAuthGuard)
export class ConsultaComplejaController {
  constructor(private consultaComplejaService: ConsultaComplejaService) {}

  @Get()
  async findAll(@Request() req, @Query('userId') userId?: number, @Query('investigadorId') investigadorId?: number): Promise<ConsultaCompleja[]> {
    if (investigadorId) {
      return this.consultaComplejaService.findByInvestigador(investigadorId);
    }
    
    if (userId) {
      return this.consultaComplejaService.findByUser(userId);
    }
    
    // If no filters specified, return user's own consultations
    return this.consultaComplejaService.findByUser(req.user.userId);
  }

  @Get('all')
  async findAllAdmin(): Promise<ConsultaCompleja[]> {
    return this.consultaComplejaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ConsultaCompleja> {
    return this.consultaComplejaService.findOne(id);
  }

  @Post()
  async create(@Body(ValidationPipe) createConsultaComplejaDto: CreateConsultaComplejaDto): Promise<ConsultaCompleja> {
    return this.consultaComplejaService.create(createConsultaComplejaDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number, 
    @Body(ValidationPipe) updateConsultaComplejaDto: UpdateConsultaComplejaDto
  ): Promise<ConsultaCompleja> {
    return this.consultaComplejaService.update(id, updateConsultaComplejaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.consultaComplejaService.remove(id);
  }
}