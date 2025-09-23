import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestigadoresController } from './investigadores.controller';
import { InvestigadoresService } from './investigadores.service';
import { Investigador } from '../../entities/investigador.entity';
import { InvestigadorArea } from '../../entities/investigador-area.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Investigador, InvestigadorArea])],
  controllers: [InvestigadoresController],
  providers: [InvestigadoresService],
  exports: [InvestigadoresService],
})
export class InvestigadoresModule {}