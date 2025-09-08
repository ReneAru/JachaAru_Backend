import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

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

@Module({
  imports: [
    TypeOrmModule.forFeature([Fuente, Year, TipoDesegregacion, Desegregacion]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: '24h' },
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
  ],
  exports: [
    FuenteService,
    YearService,
    TipoDesegregacionService,
    DesegregacionService,
  ],
})
export class DataModule {}