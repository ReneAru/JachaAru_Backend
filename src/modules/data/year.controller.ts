import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ValidationPipe } from '@nestjs/common';
import { YearService } from './year.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CreateYearDto, UpdateYearDto } from '../../dto/year.dto';
import { Year } from '../../entities/year.entity';

@Controller('years')
@UseGuards(JwtAuthGuard)
export class YearController {
  constructor(private yearService: YearService) {}

  @Get()
  async findAll(): Promise<Year[]> {
    return this.yearService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Year> {
    return this.yearService.findOne(id);
  }

  @Post()
  async create(@Body(ValidationPipe) createYearDto: CreateYearDto): Promise<Year> {
    return this.yearService.create(createYearDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number, 
    @Body(ValidationPipe) updateYearDto: UpdateYearDto
  ): Promise<Year> {
    return this.yearService.update(id, updateYearDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.yearService.remove(id);
  }
}