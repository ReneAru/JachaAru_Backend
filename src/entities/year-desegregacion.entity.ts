import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Desegregacion } from './desegregacion.entity';
import { Year } from './year.entity';

@Entity('year_desegregacion')
export class YearDesegregacion extends BaseEntity {
  @Column({ name: 'desegregacion_id' })
  desegregacionId: number;

  @Column({ name: 'year_id' })
  yearId: number;

  @ManyToOne(
    () => Desegregacion,
    (desegregacion) => desegregacion.yearDesegregaciones,
  )
  @JoinColumn({ name: 'desegregacion_id' })
  desegregacion: Desegregacion;

  @ManyToOne(() => Year, (year) => year.yearDesegregaciones)
  @JoinColumn({ name: 'year_id' })
  year: Year;
}
