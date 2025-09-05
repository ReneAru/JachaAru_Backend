import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { ConsultaRapida } from '../../entities/consulta-rapida.entity';
import { ConsultaFiltro } from '../../entities/consulta-filtro.entity';
import { ConsultaCompleja } from '../../entities/consulta-compleja.entity';

import { ConsultaRapidaService } from './consulta-rapida.service';
import { ConsultaFiltroService } from './consulta-filtro.service';
import { ConsultaComplejaService } from './consulta-compleja.service';

import { ConsultaRapidaController } from './consulta-rapida.controller';
import { ConsultaFiltroController } from './consulta-filtro.controller';
import { ConsultaComplejaController } from './consulta-compleja.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConsultaRapida, ConsultaFiltro, ConsultaCompleja]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [
    ConsultaRapidaController,
    ConsultaFiltroController,
    ConsultaComplejaController,
  ],
  providers: [
    ConsultaRapidaService,
    ConsultaFiltroService,
    ConsultaComplejaService,
  ],
  exports: [
    ConsultaRapidaService,
    ConsultaFiltroService,
    ConsultaComplejaService,
  ],
})
export class ConsultationsModule {}