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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
