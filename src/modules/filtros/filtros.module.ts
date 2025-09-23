import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FiltrosController } from './filtros.controller';
import { FiltrosService } from './filtros.service';
import { Filtro } from '../../entities/filtro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Filtro])],
  controllers: [FiltrosController],
  providers: [FiltrosService],
  exports: [FiltrosService],
})
export class FiltrosModule {}