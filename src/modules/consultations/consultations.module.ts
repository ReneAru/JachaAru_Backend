import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ConsultaRapida } from '../../entities/consulta-rapida.entity';
import { ConsultaFiltro } from '../../entities/consulta-filtro.entity';
import { ConsultaCompleja } from '../../entities/consulta-compleja.entity';

import { ConsultaRapidaService } from './consulta-rapida.service';
import { ConsultaFiltroService } from './consulta-filtro.service';
import { ConsultaComplejaService } from './consulta-compleja.service';

import { ConsultaRapidaController } from './consulta-rapida.controller';
import { ConsultaFiltroController } from './consulta-filtro.controller';
import { ConsultaComplejaController } from './consulta-compleja.controller';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConsultaRapida, ConsultaFiltro, ConsultaCompleja]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'jacha-aru-secret'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
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
    JwtAuthGuard,
  ],
  exports: [
    ConsultaRapidaService,
    ConsultaFiltroService,
    ConsultaComplejaService,
  ],
})
export class ConsultationsModule {}