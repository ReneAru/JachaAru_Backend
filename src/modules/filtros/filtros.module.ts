import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FiltrosController } from './filtros.controller';
import { FiltrosService } from './filtros.service';
import { Filtro } from '../../entities/filtro.entity';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Filtro]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'jacha-aru-secret'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [FiltrosController],
  providers: [FiltrosService, JwtAuthGuard],
  exports: [FiltrosService],
})
export class FiltrosModule {}