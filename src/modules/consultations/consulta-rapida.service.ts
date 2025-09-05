import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConsultaRapida } from '../../entities/consulta-rapida.entity';
import { CreateConsultaRapidaDto, UpdateConsultaRapidaDto } from '../../dto/consulta.dto';

@Injectable()
export class ConsultaRapidaService {
  private readonly logger = new Logger(ConsultaRapidaService.name);

  constructor(
    @InjectRepository(ConsultaRapida)
    private consultaRapidaRepository: Repository<ConsultaRapida>,
  ) {}

  async findAll(): Promise<ConsultaRapida[]> {
    this.logger.debug('Fetching all quick consultations');
    return await this.consultaRapidaRepository.find({
      relations: ['usuario', 'filtro'],
      order: { startDate: 'DESC' },
    });
  }

  async findByUser(usuarioId: number): Promise<ConsultaRapida[]> {
    this.logger.debug(`Fetching quick consultations for user ID: ${usuarioId}`);
    return await this.consultaRapidaRepository.find({
      where: { usuarioId },
      relations: ['usuario', 'filtro'],
      order: { startDate: 'DESC' },
    });
  }

  async findOne(id: number): Promise<ConsultaRapida> {
    this.logger.debug(`Fetching quick consultation with ID: ${id}`);
    const consulta = await this.consultaRapidaRepository.findOne({
      where: { id },
      relations: ['usuario', 'filtro', 'respuestas'],
    });

    if (!consulta) {
      this.logger.warn(`Quick consultation not found with ID: ${id}`);
      throw new NotFoundException(`Quick consultation with ID ${id} not found`);
    }

    return consulta;
  }

  async create(createConsultaRapidaDto: CreateConsultaRapidaDto): Promise<ConsultaRapida> {
    this.logger.debug(`Creating new quick consultation for user ID: ${createConsultaRapidaDto.usuarioId}`);
    
    const consulta = this.consultaRapidaRepository.create(createConsultaRapidaDto);
    const savedConsulta = await this.consultaRapidaRepository.save(consulta);
    
    this.logger.log(`Quick consultation created successfully (ID: ${savedConsulta.id})`);
    return this.findOne(savedConsulta.id);
  }

  async update(id: number, updateConsultaRapidaDto: UpdateConsultaRapidaDto): Promise<ConsultaRapida> {
    this.logger.debug(`Updating quick consultation ID: ${id}`);
    
    const consulta = await this.findOne(id);
    
    Object.assign(consulta, updateConsultaRapidaDto);
    const updatedConsulta = await this.consultaRapidaRepository.save(consulta);
    
    this.logger.log(`Quick consultation updated successfully (ID: ${updatedConsulta.id})`);
    return this.findOne(updatedConsulta.id);
  }

  async remove(id: number): Promise<void> {
    this.logger.debug(`Soft deleting quick consultation ID: ${id}`);
    
    const consulta = await this.findOne(id);
    
    try {
      const result = await this.consultaRapidaRepository.softDelete(id);
      
      if (result.affected === 0) {
        throw new NotFoundException(`Quick consultation with ID ${id} not found`);
      }
      
      this.logger.log(`Quick consultation soft deleted successfully with ID: ${id}`);
    } catch (error) {
      this.logger.error(`Error deleting quick consultation ID ${id}: ${error.message}`);
      throw error;
    }
  }
}