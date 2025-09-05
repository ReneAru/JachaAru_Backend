import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { InvestigadorArea } from './investigador-area.entity';
import { ConsultaCompleja } from './consulta-compleja.entity';
import { ConsultaFiltro } from './consulta-filtro.entity';

@Entity('investigador')
export class Investigador extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  nombre: string;

  @Column({ type: 'varchar', length: 50 })
  apellido: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  correo: string;

  @Column({ name: 'telegram_id', type: 'varchar', length: 50, nullable: true })
  telegramId: string;

  @OneToMany(
    () => InvestigadorArea,
    (investigadorArea) => investigadorArea.investigador,
  )
  investigadorAreas: InvestigadorArea[];

  @OneToMany(
    () => ConsultaCompleja,
    (consultaCompleja) => consultaCompleja.investigador,
  )
  consultasComplejas: ConsultaCompleja[];

  @OneToMany(
    () => ConsultaFiltro,
    (consultaFiltro) => consultaFiltro.investigador,
  )
  consultasFiltros: ConsultaFiltro[];
}
