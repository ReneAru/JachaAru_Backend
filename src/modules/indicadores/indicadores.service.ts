import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Indicador } from '../../entities/indicador.entity';
import { CreateIndicadorDto, UpdateIndicadorDto } from '../../dto/indicador.dto';

@Injectable()
export class IndicadoresService {
  private readonly logger = new Logger(IndicadoresService.name);

  constructor(
    @InjectRepository(Indicador)
    private indicadorRepository: Repository<Indicador>,
  ) {}

  async findAll(): Promise<Indicador[]> {
    this.logger.debug('Fetching all indicators');
    return await this.indicadorRepository.find({
      relations: ['indicadorTemas', 'indicadorTemas.tema', 'indicadorTemas.tema.categoria'],
      order: { indicador: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Indicador> {
    this.logger.debug(`Fetching indicator with ID: ${id}`);
    const indicador = await this.indicadorRepository.findOne({
      where: { id },
      relations: ['indicadorTemas', 'indicadorTemas.tema', 'indicadorTemas.tema.categoria', 'tipoDesegregacionIndicadores'],
    });

    if (!indicador) {
      this.logger.warn(`Indicator not found with ID: ${id}`);
      throw new NotFoundException(`Indicator with ID ${id} not found`);
    }

    return indicador;
  }

  async findByTema(temaId: number): Promise<Indicador[]> {
    this.logger.debug(`Fetching indicators for theme ID: ${temaId}`);
    return await this.indicadorRepository
      .createQueryBuilder('indicador')
      .innerJoin('indicador.indicadorTemas', 'indicadorTema')
      .where('indicadorTema.temaId = :temaId', { temaId })
      .orderBy('indicador.indicador', 'ASC')
      .getMany();
  }

  async create(createIndicadorDto: CreateIndicadorDto): Promise<Indicador> {
    this.logger.debug(`Creating new indicator: ${createIndicadorDto.indicador}`);
    
    const indicador = this.indicadorRepository.create(createIndicadorDto);
    const savedIndicador = await this.indicadorRepository.save(indicador);
    
    this.logger.log(`Indicator created successfully: ${savedIndicador.indicador} (ID: ${savedIndicador.id})`);
    return this.findOne(savedIndicador.id); // Return with relations
  }

  async update(id: number, updateIndicadorDto: UpdateIndicadorDto): Promise<Indicador> {
    this.logger.debug(`Updating indicator ID: ${id}`);
    
    const indicador = await this.findOne(id);
    
    Object.assign(indicador, updateIndicadorDto);
    const updatedIndicador = await this.indicadorRepository.save(indicador);
    
    this.logger.log(`Indicator updated successfully: ${updatedIndicador.indicador} (ID: ${updatedIndicador.id})`);
    return this.findOne(updatedIndicador.id); // Return with relations
  }

  async remove(id: number): Promise<void> {
    this.logger.debug(`Soft deleting indicator ID: ${id}`);
    
    const result = await this.indicadorRepository.softDelete(id);
    
    if (result.affected === 0) {
      this.logger.warn(`Indicator not found for deletion with ID: ${id}`);
      throw new NotFoundException(`Indicator with ID ${id} not found`);
    }
    
    this.logger.log(`Indicator soft deleted successfully with ID: ${id}`);
  }
}