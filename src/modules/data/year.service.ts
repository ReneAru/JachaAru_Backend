import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Year } from '../../entities/year.entity';
import { CreateYearDto, UpdateYearDto } from '../../dto/year.dto';

@Injectable()
export class YearService {
  private readonly logger = new Logger(YearService.name);

  constructor(
    @InjectRepository(Year)
    private yearRepository: Repository<Year>,
  ) {}

  async findAll(): Promise<Year[]> {
    this.logger.debug('Fetching all years');
    return await this.yearRepository.find({
      relations: ['fuenteYears', 'filtros', 'yearDesegregaciones'],
      order: { year: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Year> {
    this.logger.debug(`Fetching year with ID: ${id}`);
    const year = await this.yearRepository.findOne({
      where: { id },
      relations: ['fuenteYears', 'fuenteYears.fuente', 'filtros', 'yearDesegregaciones'],
    });

    if (!year) {
      this.logger.warn(`Year not found with ID: ${id}`);
      throw new NotFoundException(`Year with ID ${id} not found`);
    }

    return year;
  }

  async create(createYearDto: CreateYearDto): Promise<Year> {
    this.logger.debug(`Creating new year: ${createYearDto.year}`);
    
    const year = this.yearRepository.create(createYearDto);
    const savedYear = await this.yearRepository.save(year);
    
    this.logger.log(`Year created successfully: ${savedYear.year} (ID: ${savedYear.id})`);
    return this.findOne(savedYear.id);
  }

  async update(id: number, updateYearDto: UpdateYearDto): Promise<Year> {
    this.logger.debug(`Updating year ID: ${id}`);
    
    const year = await this.findOne(id);
    
    Object.assign(year, updateYearDto);
    const updatedYear = await this.yearRepository.save(year);
    
    this.logger.log(`Year updated successfully: ${updatedYear.year} (ID: ${updatedYear.id})`);
    return this.findOne(updatedYear.id);
  }

  async remove(id: number): Promise<void> {
    this.logger.debug(`Soft deleting year ID: ${id}`);
    
    const year = await this.findOne(id);
    
    try {
      const result = await this.yearRepository.softDelete(id);
      
      if (result.affected === 0) {
        throw new NotFoundException(`Year with ID ${id} not found`);
      }
      
      this.logger.log(`Year soft deleted successfully with ID: ${id}`);
    } catch (error) {
      this.logger.error(`Error deleting year ID ${id}: ${error.message}`);
      throw error;
    }
  }
}