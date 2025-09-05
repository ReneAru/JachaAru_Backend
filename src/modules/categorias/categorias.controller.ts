import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ValidationPipe } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateCategoriaDto, UpdateCategoriaDto } from '../../dto/categoria.dto';
import { Categoria } from '../../entities/categoria.entity';

@Controller('categorias')
@UseGuards(JwtAuthGuard)
export class CategoriasController {
  constructor(private categoriasService: CategoriasService) {}

  @Get()
  async findAll(): Promise<Categoria[]> {
    return this.categoriasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Categoria> {
    return this.categoriasService.findOne(id);
  }

  @Get(':id/temas')
  async findTemas(@Param('id') id: number) {
    return this.categoriasService.findTemas(id);
  }

  @Post()
  async create(@Body(ValidationPipe) createCategoriaDto: CreateCategoriaDto): Promise<Categoria> {
    return this.categoriasService.create(createCategoriaDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number, 
    @Body(ValidationPipe) updateCategoriaDto: UpdateCategoriaDto
  ): Promise<Categoria> {
    return this.categoriasService.update(id, updateCategoriaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.categoriasService.remove(id);
  }
}