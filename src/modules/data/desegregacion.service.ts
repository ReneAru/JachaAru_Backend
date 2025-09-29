import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoDesegregacion } from '../../entities/tipo-desegregacion.entity';
import { Desegregacion } from '../../entities/desegregacion.entity';
import { CreateTipoDesegregacionDto, UpdateTipoDesegregacionDto, CreateDesegregacionDto, UpdateDesegregacionDto } from '../../dto/desegregacion.dto';

@Injectable()
export class TipoDesegregacionService {
  private readonly logger = new Logger(TipoDesegregacionService.name);

  constructor(
    @InjectRepository(TipoDesegregacion)
    private tipoDesegregacionRepository: Repository<TipoDesegregacion>,
  ) {}

  async findAll(): Promise<TipoDesegregacion[]> {
    this.logger.debug('Fetching all disaggregation types');
    return await this.tipoDesegregacionRepository.find({
      relations: ['desegregaciones', 'tipoDesegregacionIndicadores'],
      order: { tipoDesg: 'ASC' },
    });
  }

  async findOne(id: number): Promise<TipoDesegregacion> {
    this.logger.debug(`Fetching disaggregation type with ID: ${id}`);
    const tipo = await this.tipoDesegregacionRepository.findOne({
      where: { id },
      relations: ['desegregaciones', 'tipoDesegregacionIndicadores'],
    });

    if (!tipo) {
      this.logger.warn(`Disaggregation type not found with ID: ${id}`);
      throw new NotFoundException(`Disaggregation type with ID ${id} not found`);
    }

    return tipo;
  }

  async create(createTipoDesegregacionDto: CreateTipoDesegregacionDto): Promise<TipoDesegregacion> {
    this.logger.debug(`Creating new disaggregation type: ${createTipoDesegregacionDto.tipoDesg}`);
    
    const tipo = this.tipoDesegregacionRepository.create(createTipoDesegregacionDto);
    const savedTipo = await this.tipoDesegregacionRepository.save(tipo);
    
    this.logger.log(`Disaggregation type created successfully: ${savedTipo.tipoDesg} (ID: ${savedTipo.id})`);
    return this.findOne(savedTipo.id);
  }

  async update(id: number, updateTipoDesegregacionDto: UpdateTipoDesegregacionDto): Promise<TipoDesegregacion> {
    this.logger.debug(`Updating disaggregation type ID: ${id}`);
    
    const tipo = await this.findOne(id);
    
    Object.assign(tipo, updateTipoDesegregacionDto);
    const updatedTipo = await this.tipoDesegregacionRepository.save(tipo);
    
    this.logger.log(`Disaggregation type updated successfully: ${updatedTipo.tipoDesg} (ID: ${updatedTipo.id})`);
    return this.findOne(updatedTipo.id);
  }

  async remove(id: number): Promise<void> {
    this.logger.debug(`Soft deleting disaggregation type ID: ${id}`);
    
    const tipo = await this.findOne(id);
    
    try {
      const result = await this.tipoDesegregacionRepository.softDelete(id);
      
      if (result.affected === 0) {
        throw new NotFoundException(`Disaggregation type with ID ${id} not found`);
      }
      
      this.logger.log(`Disaggregation type soft deleted successfully with ID: ${id}`);
    } catch (error) {
      this.logger.error(`Error deleting disaggregation type ID ${id}: ${error.message}`);
      throw error;
    }
  }
}

@Injectable()
export class DesegregacionService {
  private readonly logger = new Logger(DesegregacionService.name);

  constructor(
    @InjectRepository(Desegregacion)
    private desegregacionRepository: Repository<Desegregacion>,
  ) {}

  async findAll(): Promise<Desegregacion[]> {
    this.logger.debug('Fetching all disaggregations');
    return await this.desegregacionRepository.find({
      relations: ['tipoDesegregacion', 'yearDesegregaciones', 'filtros'],
      order: { desagregacion: 'ASC' },
    });
  }

  async findByTipo(tipoDesegregacionId: number): Promise<Desegregacion[]> {
    this.logger.debug(`Fetching disaggregations for type ID: ${tipoDesegregacionId}`);
    return await this.desegregacionRepository.find({
      where: { tipoDesegregacionId },
      relations: ['tipoDesegregacion'],
      order: { desagregacion: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Desegregacion> {
    this.logger.debug(`Fetching disaggregation with ID: ${id}`);
    const desegregacion = await this.desegregacionRepository.findOne({
      where: { id },
      relations: ['tipoDesegregacion', 'yearDesegregaciones', 'filtros'],
    });

    if (!desegregacion) {
      this.logger.warn(`Disaggregation not found with ID: ${id}`);
      throw new NotFoundException(`Disaggregation with ID ${id} not found`);
    }

    return desegregacion;
  }

  async create(createDesegregacionDto: CreateDesegregacionDto): Promise<Desegregacion> {
    this.logger.debug(`Creating new disaggregation: ${createDesegregacionDto.desagregacion}`);
    
    const desegregacion = this.desegregacionRepository.create(createDesegregacionDto);
    const savedDesegregacion = await this.desegregacionRepository.save(desegregacion);
    
    this.logger.log(`Disaggregation created successfully: ${savedDesegregacion.desagregacion} (ID: ${savedDesegregacion.id})`);
    return this.findOne(savedDesegregacion.id);
  }

  async update(id: number, updateDesegregacionDto: UpdateDesegregacionDto): Promise<Desegregacion> {
    this.logger.debug(`Updating disaggregation ID: ${id}`);
    
    const desegregacion = await this.findOne(id);
    
    Object.assign(desegregacion, updateDesegregacionDto);
    const updatedDesegregacion = await this.desegregacionRepository.save(desegregacion);
    
    this.logger.log(`Disaggregation updated successfully: ${updatedDesegregacion.desagregacion} (ID: ${updatedDesegregacion.id})`);
    return this.findOne(updatedDesegregacion.id);
  }

  async remove(id: number): Promise<void> {
    this.logger.debug(`Soft deleting disaggregation ID: ${id}`);
    
    const desegregacion = await this.findOne(id);
    
    try {
      const result = await this.desegregacionRepository.softDelete(id);
      
      if (result.affected === 0) {
        throw new NotFoundException(`Disaggregation with ID ${id} not found`);
      }
      
      this.logger.log(`Disaggregation soft deleted successfully with ID: ${id}`);
    } catch (error) {
      this.logger.error(`Error deleting disaggregation ID ${id}: ${error.message}`);
      throw error;
    }
  }
}