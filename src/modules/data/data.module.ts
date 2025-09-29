import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Fuente } from '../../entities/fuente.entity';
import { Year } from '../../entities/year.entity';
import { TipoDesegregacion } from '../../entities/tipo-desegregacion.entity';
import { Desegregacion } from '../../entities/desegregacion.entity';

import { FuenteService } from './fuente.service';
import { YearService } from './year.service';
import { TipoDesegregacionService, DesegregacionService } from './desegregacion.service';

import { FuenteController } from './fuente.controller';
import { YearController } from './year.controller';
import { TipoDesegregacionController, DesegregacionController } from './desegregacion.controller';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Fuente, Year, TipoDesegregacion, Desegregacion]),
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
    FuenteController,
    YearController,
    TipoDesegregacionController,
    DesegregacionController,
  ],
  providers: [
    FuenteService,
    YearService,
    TipoDesegregacionService,
    DesegregacionService,
    JwtAuthGuard,
  ],
  exports: [
    FuenteService,
    YearService,
    TipoDesegregacionService,
    DesegregacionService,
  ],
})
export class DataModule {}