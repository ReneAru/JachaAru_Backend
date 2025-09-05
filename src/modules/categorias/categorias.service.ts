import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from '../../entities/categoria.entity';
import { CreateCategoriaDto, UpdateCategoriaDto } from '../../dto/categoria.dto';

@Injectable()
export class CategoriasService {
  private readonly logger = new Logger(CategoriasService.name);

  constructor(
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
  ) {}

  async findAll(): Promise<Categoria[]> {
    this.logger.debug('Fetching all categories');
    return await this.categoriaRepository.find({
      relations: ['temas'],
      order: { categoria: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Categoria> {
    this.logger.debug(`Fetching category with ID: ${id}`);
    const categoria = await this.categoriaRepository.findOne({
      where: { id },
      relations: ['temas', 'investigadorAreas'],
    });

    if (!categoria) {
      this.logger.warn(`Category not found with ID: ${id}`);
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return categoria;
  }

  async findTemas(id: number) {
    this.logger.debug(`Fetching themes for category ID: ${id}`);
    const categoria = await this.categoriaRepository.findOne({
      where: { id },
      relations: ['temas'],
    });

    if (!categoria) {
      this.logger.warn(`Category not found when fetching themes for ID: ${id}`);
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return categoria.temas;
  }

  async create(createCategoriaDto: CreateCategoriaDto): Promise<Categoria> {
    this.logger.debug(`Creating new category: ${createCategoriaDto.categoria}`);
    
    const categoria = this.categoriaRepository.create(createCategoriaDto);
    const savedCategoria = await this.categoriaRepository.save(categoria);
    
    this.logger.log(`Category created successfully: ${savedCategoria.categoria} (ID: ${savedCategoria.id})`);
    return savedCategoria;
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto): Promise<Categoria> {
    this.logger.debug(`Updating category ID: ${id}`);
    
    const categoria = await this.findOne(id);
    
    Object.assign(categoria, updateCategoriaDto);
    const updatedCategoria = await this.categoriaRepository.save(categoria);
    
    this.logger.log(`Category updated successfully: ${updatedCategoria.categoria} (ID: ${updatedCategoria.id})`);
    return updatedCategoria;
  }

  async remove(id: number): Promise<void> {
    this.logger.debug(`Soft deleting category ID: ${id}`);
    
    const result = await this.categoriaRepository.softDelete(id);
    
    if (result.affected === 0) {
      this.logger.warn(`Category not found for deletion with ID: ${id}`);
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    
    this.logger.log(`Category soft deleted successfully with ID: ${id}`);
  }
}