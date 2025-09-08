import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fuente } from '../../entities/fuente.entity';
import { CreateFuenteDto, UpdateFuenteDto } from '../../dto/fuente.dto';

@Injectable()
export class FuenteService {
  private readonly logger = new Logger(FuenteService.name);

  constructor(
    @InjectRepository(Fuente)
    private fuenteRepository: Repository<Fuente>,
  ) {}

  async findAll(): Promise<Fuente[]> {
    this.logger.debug('Fetching all sources');
    return await this.fuenteRepository.find({
      relations: ['fuenteYears', 'filtros'],
      order: { fuente: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Fuente> {
    this.logger.debug(`Fetching source with ID: ${id}`);
    const fuente = await this.fuenteRepository.findOne({
      where: { id },
      relations: ['fuenteYears', 'fuenteYears.year', 'filtros'],
    });

    if (!fuente) {
      this.logger.warn(`Source not found with ID: ${id}`);
      throw new NotFoundException(`Source with ID ${id} not found`);
    }

    return fuente;
  }

  async create(createFuenteDto: CreateFuenteDto): Promise<Fuente> {
    this.logger.debug(`Creating new source: ${createFuenteDto.fuente}`);
    
    const fuente = this.fuenteRepository.create(createFuenteDto);
    const savedFuente = await this.fuenteRepository.save(fuente);
    
    this.logger.log(`Source created successfully: ${savedFuente.fuente} (ID: ${savedFuente.id})`);
    return this.findOne(savedFuente.id);
  }

  async update(id: number, updateFuenteDto: UpdateFuenteDto): Promise<Fuente> {
    this.logger.debug(`Updating source ID: ${id}`);
    
    const fuente = await this.findOne(id);
    
    Object.assign(fuente, updateFuenteDto);
    const updatedFuente = await this.fuenteRepository.save(fuente);
    
    this.logger.log(`Source updated successfully: ${updatedFuente.fuente} (ID: ${updatedFuente.id})`);
    return this.findOne(updatedFuente.id);
  }

  async remove(id: number): Promise<void> {
    this.logger.debug(`Soft deleting source ID: ${id}`);
    
    const fuente = await this.findOne(id);
    
    try {
      const result = await this.fuenteRepository.softDelete(id);
      
      if (result.affected === 0) {
        throw new NotFoundException(`Source with ID ${id} not found`);
      }
      
      this.logger.log(`Source soft deleted successfully with ID: ${id}`);
    } catch (error) {
      this.logger.error(`Error deleting source ID ${id}: ${error.message}`);
      throw error;
    }
  }
}