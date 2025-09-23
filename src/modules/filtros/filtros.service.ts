import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Filtro } from '../../entities/filtro.entity';
import { CreateFiltroDto, UpdateFiltroDto } from '../../dto/filtro.dto';

@Injectable()
export class FiltrosService {
  private readonly logger = new Logger(FiltrosService.name);

  constructor(
    @InjectRepository(Filtro)
    private filtroRepository: Repository<Filtro>,
  ) {}

  async findAll(): Promise<Filtro[]> {
    this.logger.debug('Fetching all filters');
    return await this.filtroRepository.find({
      relations: [
        'categoria', 
        'tema', 
        'indicador', 
        'desegregacion', 
        'year', 
        'fuente', 
        'fichaMetodologica'
      ],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Filtro> {
    this.logger.debug(`Fetching filter with ID: ${id}`);
    const filtro = await this.filtroRepository.findOne({
      where: { id },
      relations: [
        'categoria', 
        'tema', 
        'indicador', 
        'desegregacion', 
        'year', 
        'fuente', 
        'fichaMetodologica',
        'consultasFiltros',
        'consultasRapidas'
      ],
    });

    if (!filtro) {
      this.logger.warn(`Filter not found with ID: ${id}`);
      throw new NotFoundException(`Filter with ID ${id} not found`);
    }

    return filtro;
  }

  async findByCategoria(categoriaId: number): Promise<Filtro[]> {
    this.logger.debug(`Fetching filters for categoria ID: ${categoriaId}`);
    return await this.filtroRepository.find({
      where: { categoriaId },
      relations: [
        'categoria', 
        'tema', 
        'indicador', 
        'desegregacion', 
        'year', 
        'fuente', 
        'fichaMetodologica'
      ],
      order: { id: 'DESC' },
    });
  }

  async findByTema(temaId: number): Promise<Filtro[]> {
    this.logger.debug(`Fetching filters for tema ID: ${temaId}`);
    return await this.filtroRepository.find({
      where: { temaId },
      relations: [
        'categoria', 
        'tema', 
        'indicador', 
        'desegregacion', 
        'year', 
        'fuente', 
        'fichaMetodologica'
      ],
      order: { id: 'DESC' },
    });
  }

  async create(createFiltroDto: CreateFiltroDto): Promise<Filtro> {
    this.logger.debug(`Creating new filter with categoria: ${createFiltroDto.categoriaId}, tema: ${createFiltroDto.temaId}`);
    
    // Check if a similar filter already exists
    const existingFiltro = await this.filtroRepository.findOne({
      where: {
        categoriaId: createFiltroDto.categoriaId,
        temaId: createFiltroDto.temaId,
        indicadorId: createFiltroDto.indicadorId,
        desegregacionId: createFiltroDto.desegregacionId,
        yearId: createFiltroDto.yearId,
        fuenteId: createFiltroDto.fuenteId,
        fichaMetodologicaId: createFiltroDto.fichaMetodologicaId,
      }
    });

    if (existingFiltro) {
      this.logger.warn(`Filter with same configuration already exists: ID ${existingFiltro.id}`);
      throw new BadRequestException(`A filter with the same configuration already exists`);
    }

    const filtro = this.filtroRepository.create(createFiltroDto);
    const savedFiltro = await this.filtroRepository.save(filtro);
    
    this.logger.log(`Filter created successfully: ID ${savedFiltro.id}`);
    return this.findOne(savedFiltro.id);
  }

  async update(id: number, updateFiltroDto: UpdateFiltroDto): Promise<Filtro> {
    this.logger.debug(`Updating filter ID: ${id}`);
    
    const filtro = await this.findOne(id);
    
    // Check if update would create a duplicate
    if (Object.keys(updateFiltroDto).some(key => key !== 'state')) {
      const checkData = { ...filtro, ...updateFiltroDto };
      const existingFiltro = await this.filtroRepository.findOne({
        where: {
          categoriaId: checkData.categoriaId,
          temaId: checkData.temaId,
          indicadorId: checkData.indicadorId,
          desegregacionId: checkData.desegregacionId,
          yearId: checkData.yearId,
          fuenteId: checkData.fuenteId,
          fichaMetodologicaId: checkData.fichaMetodologicaId,
        }
      });

      if (existingFiltro && existingFiltro.id !== id) {
        this.logger.warn(`Filter update would create duplicate: ID ${existingFiltro.id}`);
        throw new BadRequestException(`A filter with the same configuration already exists`);
      }
    }
    
    Object.assign(filtro, updateFiltroDto);
    const updatedFiltro = await this.filtroRepository.save(filtro);
    
    this.logger.log(`Filter updated successfully: ID ${updatedFiltro.id}`);
    return this.findOne(updatedFiltro.id);
  }

  async remove(id: number): Promise<void> {
    this.logger.debug(`Soft deleting filter ID: ${id}`);
    
    const filtro = await this.filtroRepository.findOne({
      where: { id },
      relations: ['consultasFiltros', 'consultasRapidas'],
    });
    
    if (!filtro) {
      this.logger.warn(`Filter not found for deletion with ID: ${id}`);
      throw new NotFoundException(`Filter with ID ${id} not found`);
    }
    
    if (filtro.consultasFiltros && filtro.consultasFiltros.length > 0) {
      this.logger.warn(`Cannot delete filter ID ${id}: has ${filtro.consultasFiltros.length} filter consultations`);
      throw new BadRequestException(`Cannot delete filter: it has ${filtro.consultasFiltros.length} filter consultations. Delete consultations first.`);
    }
    
    if (filtro.consultasRapidas && filtro.consultasRapidas.length > 0) {
      this.logger.warn(`Cannot delete filter ID ${id}: has ${filtro.consultasRapidas.length} quick consultations`);
      throw new BadRequestException(`Cannot delete filter: it has ${filtro.consultasRapidas.length} quick consultations. Delete consultations first.`);
    }
    
    try {
      const result = await this.filtroRepository.softDelete(id);
      
      if (result.affected === 0) {
        throw new NotFoundException(`Filter with ID ${id} not found`);
      }
      
      this.logger.log(`Filter soft deleted successfully with ID: ${id}`);
    } catch (error) {
      this.logger.error(`Error deleting filter ID ${id}: ${error.message}`);
      
      if (error.code === '23503') {
        throw new BadRequestException(`Cannot delete filter: it has related data. Please remove related items first.`);
      }
      
      throw error;
    }
  }
}