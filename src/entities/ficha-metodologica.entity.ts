import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { FichaFuente } from './ficha-fuente.entity';
import { Filtro } from './filtro.entity';

@Entity('ficha_metodologica')
export class FichaMetodologica extends BaseEntity {
  @Column({ type: 'varchar', length: 200 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'text', nullable: true })
  metodologia: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  fuente_datos: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  periodicidad: string;

  @Column({ type: 'int', nullable: true })
  version: number;

  @OneToMany(() => FichaFuente, (fichaFuente) => fichaFuente.fichaMetodologica)
  fichaFuentes: FichaFuente[];

  @OneToMany(() => Filtro, (filtro) => filtro.fichaMetodologica)
  filtros: Filtro[];
}
