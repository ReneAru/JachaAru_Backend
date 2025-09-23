import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { CategoriasModule } from './modules/categorias/categorias.module';
import { TemasModule } from './modules/temas/temas.module';
import { IndicadoresModule } from './modules/indicadores/indicadores.module';
import { ConsultationsModule } from './modules/consultations/consultations.module';
import { DataModule } from './modules/data/data.module';
import { InvestigadoresModule } from './modules/investigadores/investigadores.module';
import { FiltrosModule } from './modules/filtros/filtros.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UsuariosModule,
    CategoriasModule,
    TemasModule,
    IndicadoresModule,
    ConsultationsModule,
    DataModule,
    InvestigadoresModule,
    FiltrosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
