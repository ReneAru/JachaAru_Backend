import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Year } from './year.entity';
import { Fuente } from './fuente.entity';

@Entity('fuente_year')
export class FuenteYear extends BaseEntity {
  @Column({ name: 'year_id' })
  yearId: number;

  @Column({ name: 'fuente_id' })
  fuenteId: number;

  @ManyToOne(() => Year, (year) => year.fuenteYears)
  @JoinColumn({ name: 'year_id' })
  year: Year;

  @ManyToOne(() => Fuente, (fuente) => fuente.fuenteYears)
  @JoinColumn({ name: 'fuente_id' })
  fuente: Fuente;
}
