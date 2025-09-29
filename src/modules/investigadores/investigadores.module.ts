import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InvestigadoresController } from './investigadores.controller';
import { InvestigadoresService } from './investigadores.service';
import { Investigador } from '../../entities/investigador.entity';
import { InvestigadorArea } from '../../entities/investigador-area.entity';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Investigador, InvestigadorArea]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'jacha-aru-secret'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [InvestigadoresController],
  providers: [InvestigadoresService, JwtAuthGuard],
  exports: [InvestigadoresService],
})
export class InvestigadoresModule {}