import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ValidationPipe } from '@nestjs/common';
import { InvestigadoresService } from './investigadores.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateInvestigadorDto, UpdateInvestigadorDto } from '../../dto/investigador.dto';
import { Investigador } from '../../entities/investigador.entity';

@Controller('investigadores')
@UseGuards(JwtAuthGuard)
export class InvestigadoresController {
  constructor(private investigadoresService: InvestigadoresService) {}

  @Get()
  async findAll(): Promise<Investigador[]> {
    return this.investigadoresService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Investigador> {
    return this.investigadoresService.findOne(id);
  }

  @Get(':id/consultas')
  async findConsultas(@Param('id') id: number) {
    return this.investigadoresService.findConsultas(id);
  }

  @Post()
  async create(@Body(ValidationPipe) createInvestigadorDto: CreateInvestigadorDto): Promise<Investigador> {
    return this.investigadoresService.create(createInvestigadorDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number, 
    @Body(ValidationPipe) updateInvestigadorDto: UpdateInvestigadorDto
  ): Promise<Investigador> {
    return this.investigadoresService.update(id, updateInvestigadorDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.investigadoresService.remove(id);
  }
}