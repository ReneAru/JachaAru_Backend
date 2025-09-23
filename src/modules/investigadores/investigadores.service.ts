import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investigador } from '../../entities/investigador.entity';
import { InvestigadorArea } from '../../entities/investigador-area.entity';
import { CreateInvestigadorDto, UpdateInvestigadorDto } from '../../dto/investigador.dto';

@Injectable()
export class InvestigadoresService {
  private readonly logger = new Logger(InvestigadoresService.name);

  constructor(
    @InjectRepository(Investigador)
    private investigadorRepository: Repository<Investigador>,
    @InjectRepository(InvestigadorArea)
    private investigadorAreaRepository: Repository<InvestigadorArea>,
  ) {}

  async findAll(): Promise<Investigador[]> {
    this.logger.debug('Fetching all researchers');
    return await this.investigadorRepository.find({
      relations: ['investigadorAreas', 'investigadorAreas.categoria'],
      order: { apellido: 'ASC', nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Investigador> {
    this.logger.debug(`Fetching researcher with ID: ${id}`);
    const investigador = await this.investigadorRepository.findOne({
      where: { id },
      relations: ['investigadorAreas', 'investigadorAreas.categoria', 'consultasComplejas', 'consultasFiltros'],
    });

    if (!investigador) {
      this.logger.warn(`Researcher not found with ID: ${id}`);
      throw new NotFoundException(`Researcher with ID ${id} not found`);
    }

    return investigador;
  }

  async findConsultas(id: number) {
    this.logger.debug(`Fetching consultations for researcher ID: ${id}`);
    const investigador = await this.investigadorRepository.findOne({
      where: { id },
      relations: ['consultasComplejas', 'consultasFiltros'],
    });

    if (!investigador) {
      this.logger.warn(`Researcher not found when fetching consultations for ID: ${id}`);
      throw new NotFoundException(`Researcher with ID ${id} not found`);
    }

    return {
      consultasComplejas: investigador.consultasComplejas,
      consultasFiltros: investigador.consultasFiltros,
    };
  }

  async create(createInvestigadorDto: CreateInvestigadorDto): Promise<Investigador> {
    this.logger.debug(`Creating new researcher: ${createInvestigadorDto.nombre} ${createInvestigadorDto.apellido}`);
    
    // Check if email already exists
    const existingInvestigador = await this.investigadorRepository.findOne({
      where: { correo: createInvestigadorDto.correo }
    });
    
    if (existingInvestigador) {
      this.logger.warn(`Email already exists: ${createInvestigadorDto.correo}`);
      throw new BadRequestException(`A researcher with email ${createInvestigadorDto.correo} already exists`);
    }
    
    const { categoriaIds, ...investigadorData } = createInvestigadorDto;
    const investigador = this.investigadorRepository.create(investigadorData);
    const savedInvestigador = await this.investigadorRepository.save(investigador);
    
    // Handle categoria associations if provided
    if (categoriaIds && categoriaIds.length > 0) {
      await this.updateCategoriaAssociations(savedInvestigador.id, categoriaIds);
    }
    
    this.logger.log(`Researcher created successfully: ${savedInvestigador.nombre} ${savedInvestigador.apellido} (ID: ${savedInvestigador.id})`);
    return this.findOne(savedInvestigador.id);
  }

  async update(id: number, updateInvestigadorDto: UpdateInvestigadorDto): Promise<Investigador> {
    this.logger.debug(`Updating researcher ID: ${id}`);
    
    const investigador = await this.findOne(id);
    
    // Check if email update would create conflict
    if (updateInvestigadorDto.correo && updateInvestigadorDto.correo !== investigador.correo) {
      const existingInvestigador = await this.investigadorRepository.findOne({
        where: { correo: updateInvestigadorDto.correo }
      });
      
      if (existingInvestigador) {
        this.logger.warn(`Email already exists: ${updateInvestigadorDto.correo}`);
        throw new BadRequestException(`A researcher with email ${updateInvestigadorDto.correo} already exists`);
      }
    }
    
    const { categoriaIds, ...investigadorData } = updateInvestigadorDto;
    Object.assign(investigador, investigadorData);
    const updatedInvestigador = await this.investigadorRepository.save(investigador);
    
    // Handle categoria associations if provided
    if (categoriaIds !== undefined) {
      await this.updateCategoriaAssociations(updatedInvestigador.id, categoriaIds);
    }
    
    this.logger.log(`Researcher updated successfully: ${updatedInvestigador.nombre} ${updatedInvestigador.apellido} (ID: ${updatedInvestigador.id})`);
    return this.findOne(updatedInvestigador.id);
  }

  async remove(id: number): Promise<void> {
    this.logger.debug(`Soft deleting researcher ID: ${id}`);
    
    const investigador = await this.investigadorRepository.findOne({
      where: { id },
      relations: ['consultasComplejas', 'consultasFiltros', 'investigadorAreas'],
    });
    
    if (!investigador) {
      this.logger.warn(`Researcher not found for deletion with ID: ${id}`);
      throw new NotFoundException(`Researcher with ID ${id} not found`);
    }
    
    if (investigador.consultasComplejas && investigador.consultasComplejas.length > 0) {
      this.logger.warn(`Cannot delete researcher ID ${id}: has ${investigador.consultasComplejas.length} complex consultations`);
      throw new BadRequestException(`Cannot delete researcher: it has ${investigador.consultasComplejas.length} complex consultations. Delete consultations first.`);
    }
    
    if (investigador.consultasFiltros && investigador.consultasFiltros.length > 0) {
      this.logger.warn(`Cannot delete researcher ID ${id}: has ${investigador.consultasFiltros.length} filter consultations`);
      throw new BadRequestException(`Cannot delete researcher: it has ${investigador.consultasFiltros.length} filter consultations. Delete consultations first.`);
    }
    
    try {
      // Remove area associations first
      await this.investigadorAreaRepository.delete({ investigadorId: id });
      
      const result = await this.investigadorRepository.softDelete(id);
      
      if (result.affected === 0) {
        throw new NotFoundException(`Researcher with ID ${id} not found`);
      }
      
      this.logger.log(`Researcher soft deleted successfully with ID: ${id}`);
    } catch (error) {
      this.logger.error(`Error deleting researcher ID ${id}: ${error.message}`);
      
      if (error.code === '23503') {
        throw new BadRequestException(`Cannot delete researcher: it has related data. Please remove related items first.`);
      }
      
      throw error;
    }
  }

  private async updateCategoriaAssociations(investigadorId: number, categoriaIds: number[]): Promise<void> {
    this.logger.debug(`Updating categoria associations for researcher ID: ${investigadorId}`);
    
    // Remove existing associations
    await this.investigadorAreaRepository.delete({ investigadorId });
    
    // Create new associations
    if (categoriaIds.length > 0) {
      const investigadorAreas = categoriaIds.map(categoriaId => 
        this.investigadorAreaRepository.create({ investigadorId, categoriaId })
      );
      await this.investigadorAreaRepository.save(investigadorAreas);
    }
  }
}