import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  Categoria,
  Tema,
  Indicador,
  IndicadorTema,
  Usuario,
  Investigador,
  InvestigadorArea,
  ConsultaCompleja,
  ConsultaFiltro,
  ConsultaRapida,
  Year,
  Fuente,
  FuenteYear,
  TipoDesegregacion,
  Desegregacion,
  YearDesegregacion,
  TipoDesegregacionIndicador,
  FichaMetodologica,
  FichaFuente,
  Filtro,
  RespuestaConsultaCompleja,
  RespuestaConsultaFiltro,
  RespuestaConsultaRapida,
} from '../entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: parseInt(configService.get<string>('DB_PORT', '5432'), 10),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'password'),
        database: configService.get<string>('DB_NAME', 'fundacion_aru_db'),
        entities: [
          Categoria,
          Tema,
          Indicador,
          IndicadorTema,
          Usuario,
          Investigador,
          InvestigadorArea,
          ConsultaCompleja,
          ConsultaFiltro,
          ConsultaRapida,
          Year,
          Fuente,
          FuenteYear,
          TipoDesegregacion,
          Desegregacion,
          YearDesegregacion,
          TipoDesegregacionIndicador,
          FichaMetodologica,
          FichaFuente,
          Filtro,
          RespuestaConsultaCompleja,
          RespuestaConsultaFiltro,
          RespuestaConsultaRapida,
        ],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
        ssl:
          configService.get('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
