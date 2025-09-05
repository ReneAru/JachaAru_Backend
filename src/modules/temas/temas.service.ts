import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tema } from '../../entities/tema.entity';
import { CreateTemaDto, UpdateTemaDto } from '../../dto/tema.dto';

@Injectable()
export class TemasService {
  private readonly logger = new Logger(TemasService.name);

  constructor(
    @InjectRepository(Tema)
    private temaRepository: Repository<Tema>,
  ) {}

  async findAll(): Promise<Tema[]> {
    this.logger.debug('Fetching all themes');
    return await this.temaRepository.find({
      relations: ['categoria', 'indicadorTemas'],
      order: { tema: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Tema> {
    this.logger.debug(`Fetching theme with ID: ${id}`);
    const tema = await this.temaRepository.findOne({
      where: { id },
      relations: ['categoria', 'indicadorTemas', 'indicadorTemas.indicador'],
    });

    if (!tema) {
      this.logger.warn(`Theme not found with ID: ${id}`);
      throw new NotFoundException(`Theme with ID ${id} not found`);
    }

    return tema;
  }

  async findByCategoria(categoriaId: number): Promise<Tema[]> {
    this.logger.debug(`Fetching themes for category ID: ${categoriaId}`);
    return await this.temaRepository.find({
      where: { categoriaId },
      relations: ['categoria'],
      order: { tema: 'ASC' },
    });
  }

  async create(createTemaDto: CreateTemaDto): Promise<Tema> {
    this.logger.debug(`Creating new theme: ${createTemaDto.tema}`);
    
    const tema = this.temaRepository.create(createTemaDto);
    const savedTema = await this.temaRepository.save(tema);
    
    this.logger.log(`Theme created successfully: ${savedTema.tema} (ID: ${savedTema.id})`);
    return this.findOne(savedTema.id); // Return with relations
  }

  async update(id: number, updateTemaDto: UpdateTemaDto): Promise<Tema> {
    this.logger.debug(`Updating theme ID: ${id}`);
    
    const tema = await this.findOne(id);
    
    Object.assign(tema, updateTemaDto);
    const updatedTema = await this.temaRepository.save(tema);
    
    this.logger.log(`Theme updated successfully: ${updatedTema.tema} (ID: ${updatedTema.id})`);
    return this.findOne(updatedTema.id); // Return with relations
  }

  async remove(id: number): Promise<void> {
    this.logger.debug(`Soft deleting theme ID: ${id}`);
    
    // First check if theme exists and get related data
    const tema = await this.temaRepository.findOne({
      where: { id },
      relations: ['indicadorTemas', 'filtros'],
    });
    
    if (!tema) {
      this.logger.warn(`Theme not found for deletion with ID: ${id}`);
      throw new NotFoundException(`Theme with ID ${id} not found`);
    }
    
    // Check if theme has related data that would prevent deletion
    if (tema.filtros && tema.filtros.length > 0) {
      this.logger.warn(`Cannot delete theme ID ${id}: has ${tema.filtros.length} related filters`);
      throw new BadRequestException(`Cannot delete theme: it has ${tema.filtros.length} related filters. Delete filters first.`);
    }
    
    try {
      const result = await this.temaRepository.softDelete(id);
      
      if (result.affected === 0) {
        throw new NotFoundException(`Theme with ID ${id} not found`);
      }
      
      this.logger.log(`Theme soft deleted successfully with ID: ${id}`);
    } catch (error) {
      this.logger.error(`Error deleting theme ID ${id}: ${error.message}`);
      
      if (error.code === '23503') { // Foreign key violation
        throw new BadRequestException(`Cannot delete theme: it has related data. Please remove related items first.`);
      }
      
      throw error;
    }
  }
}