import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConsultaFiltro } from '../../entities/consulta-filtro.entity';
import { CreateConsultaFiltroDto, UpdateConsultaFiltroDto } from '../../dto/consulta.dto';

@Injectable()
export class ConsultaFiltroService {
  private readonly logger = new Logger(ConsultaFiltroService.name);

  constructor(
    @InjectRepository(ConsultaFiltro)
    private consultaFiltroRepository: Repository<ConsultaFiltro>,
  ) {}

  async findAll(): Promise<ConsultaFiltro[]> {
    this.logger.debug('Fetching all filter consultations');
    return await this.consultaFiltroRepository.find({
      relations: ['usuario', 'filtro', 'investigador'],
      order: { startDate: 'DESC' },
    });
  }

  async findByUser(usuarioId: number): Promise<ConsultaFiltro[]> {
    this.logger.debug(`Fetching filter consultations for user ID: ${usuarioId}`);
    return await this.consultaFiltroRepository.find({
      where: { usuarioId },
      relations: ['usuario', 'filtro', 'investigador'],
      order: { startDate: 'DESC' },
    });
  }

  async findByInvestigador(investigadorId: number): Promise<ConsultaFiltro[]> {
    this.logger.debug(`Fetching filter consultations for investigator ID: ${investigadorId}`);
    return await this.consultaFiltroRepository.find({
      where: { investigadorId },
      relations: ['usuario', 'filtro', 'investigador'],
      order: { startDate: 'DESC' },
    });
  }

  async findOne(id: number): Promise<ConsultaFiltro> {
    this.logger.debug(`Fetching filter consultation with ID: ${id}`);
    const consulta = await this.consultaFiltroRepository.findOne({
      where: { id },
      relations: ['usuario', 'filtro', 'investigador', 'respuestas'],
    });

    if (!consulta) {
      this.logger.warn(`Filter consultation not found with ID: ${id}`);
      throw new NotFoundException(`Filter consultation with ID ${id} not found`);
    }

    return consulta;
  }

  async create(createConsultaFiltroDto: CreateConsultaFiltroDto): Promise<ConsultaFiltro> {
    this.logger.debug(`Creating new filter consultation for user ID: ${createConsultaFiltroDto.usuarioId}`);
    
    const consulta = this.consultaFiltroRepository.create(createConsultaFiltroDto);
    const savedConsulta = await this.consultaFiltroRepository.save(consulta);
    
    this.logger.log(`Filter consultation created successfully (ID: ${savedConsulta.id})`);
    return this.findOne(savedConsulta.id);
  }

  async update(id: number, updateConsultaFiltroDto: UpdateConsultaFiltroDto): Promise<ConsultaFiltro> {
    this.logger.debug(`Updating filter consultation ID: ${id}`);
    
    const consulta = await this.findOne(id);
    
    Object.assign(consulta, updateConsultaFiltroDto);
    const updatedConsulta = await this.consultaFiltroRepository.save(consulta);
    
    this.logger.log(`Filter consultation updated successfully (ID: ${updatedConsulta.id})`);
    return this.findOne(updatedConsulta.id);
  }

  async remove(id: number): Promise<void> {
    this.logger.debug(`Soft deleting filter consultation ID: ${id}`);
    
    const consulta = await this.findOne(id);
    
    try {
      const result = await this.consultaFiltroRepository.softDelete(id);
      
      if (result.affected === 0) {
        throw new NotFoundException(`Filter consultation with ID ${id} not found`);
      }
      
      this.logger.log(`Filter consultation soft deleted successfully with ID: ${id}`);
    } catch (error) {
      this.logger.error(`Error deleting filter consultation ID ${id}: ${error.message}`);
      throw error;
    }
  }
}