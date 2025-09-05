import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { FuenteYear } from './fuente-year.entity';
import { FichaFuente } from './ficha-fuente.entity';

@Entity('fuente')
export class Fuente extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  fuente: string;

  @OneToMany(() => FuenteYear, (fuenteYear) => fuenteYear.fuente)
  fuenteYears: FuenteYear[];

  @OneToMany(() => FichaFuente, (fichaFuente) => fichaFuente.fuente)
  fichaFuentes: FichaFuente[];
}
