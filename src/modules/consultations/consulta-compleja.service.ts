import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConsultaCompleja } from '../../entities/consulta-compleja.entity';
import { CreateConsultaComplejaDto, UpdateConsultaComplejaDto } from '../../dto/consulta.dto';

@Injectable()
export class ConsultaComplejaService {
  private readonly logger = new Logger(ConsultaComplejaService.name);

  constructor(
    @InjectRepository(ConsultaCompleja)
    private consultaComplejaRepository: Repository<ConsultaCompleja>,
  ) {}

  async findAll(): Promise<ConsultaCompleja[]> {
    this.logger.debug('Fetching all complex consultations');
    return await this.consultaComplejaRepository.find({
      relations: ['usuario', 'investigador'],
      order: { startDate: 'DESC' },
    });
  }

  async findByUser(usuarioId: number): Promise<ConsultaCompleja[]> {
    this.logger.debug(`Fetching complex consultations for user ID: ${usuarioId}`);
    return await this.consultaComplejaRepository.find({
      where: { usuarioId },
      relations: ['usuario', 'investigador'],
      order: { startDate: 'DESC' },
    });
  }

  async findByInvestigador(investigadorId: number): Promise<ConsultaCompleja[]> {
    this.logger.debug(`Fetching complex consultations for investigator ID: ${investigadorId}`);
    return await this.consultaComplejaRepository.find({
      where: { investigadorId },
      relations: ['usuario', 'investigador'],
      order: { startDate: 'DESC' },
    });
  }

  async findOne(id: number): Promise<ConsultaCompleja> {
    this.logger.debug(`Fetching complex consultation with ID: ${id}`);
    const consulta = await this.consultaComplejaRepository.findOne({
      where: { id },
      relations: ['usuario', 'investigador', 'respuestas'],
    });

    if (!consulta) {
      this.logger.warn(`Complex consultation not found with ID: ${id}`);
      throw new NotFoundException(`Complex consultation with ID ${id} not found`);
    }

    return consulta;
  }

  async create(createConsultaComplejaDto: CreateConsultaComplejaDto): Promise<ConsultaCompleja> {
    this.logger.debug(`Creating new complex consultation for user ID: ${createConsultaComplejaDto.usuarioId}`);
    
    const consulta = this.consultaComplejaRepository.create(createConsultaComplejaDto);
    const savedConsulta = await this.consultaComplejaRepository.save(consulta);
    
    this.logger.log(`Complex consultation created successfully (ID: ${savedConsulta.id})`);
    return this.findOne(savedConsulta.id);
  }

  async update(id: number, updateConsultaComplejaDto: UpdateConsultaComplejaDto): Promise<ConsultaCompleja> {
    this.logger.debug(`Updating complex consultation ID: ${id}`);
    
    const consulta = await this.findOne(id);
    
    Object.assign(consulta, updateConsultaComplejaDto);
    const updatedConsulta = await this.consultaComplejaRepository.save(consulta);
    
    this.logger.log(`Complex consultation updated successfully (ID: ${updatedConsulta.id})`);
    return this.findOne(updatedConsulta.id);
  }

  async remove(id: number): Promise<void> {
    this.logger.debug(`Soft deleting complex consultation ID: ${id}`);
    
    const consulta = await this.findOne(id);
    
    try {
      const result = await this.consultaComplejaRepository.softDelete(id);
      
      if (result.affected === 0) {
        throw new NotFoundException(`Complex consultation with ID ${id} not found`);
      }
      
      this.logger.log(`Complex consultation soft deleted successfully with ID: ${id}`);
    } catch (error) {
      this.logger.error(`Error deleting complex consultation ID ${id}: ${error.message}`);
      throw error;
    }
  }
}