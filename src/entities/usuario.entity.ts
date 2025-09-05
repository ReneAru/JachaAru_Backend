import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ConsultaCompleja } from './consulta-compleja.entity';
import { ConsultaFiltro } from './consulta-filtro.entity';
import { ConsultaRapida } from './consulta-rapida.entity';

@Entity('usuario')
export class Usuario extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  nombres: string;

  @Column({ type: 'varchar', length: 50 })
  apellidos: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  mail: string;

  @Column({ type: 'varchar', length: 500 })
  pass: string;

  @Column({ name: 'google_id', type: 'varchar', length: 100, nullable: true })
  googleId: string;

  @Column({ name: 'telegram_id', type: 'varchar', length: 100, nullable: true })
  telegramId: string;

  @OneToMany(
    () => ConsultaCompleja,
    (consultaCompleja) => consultaCompleja.usuario,
  )
  consultasComplejas: ConsultaCompleja[];

  @OneToMany(() => ConsultaFiltro, (consultaFiltro) => consultaFiltro.usuario)
  consultasFiltros: ConsultaFiltro[];

  @OneToMany(() => ConsultaRapida, (consultaRapida) => consultaRapida.usuario)
  consultasRapidas: ConsultaRapida[];
}
