import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { FuenteYear } from './fuente-year.entity';
import { YearDesegregacion } from './year-desegregacion.entity';

@Entity('year')
export class Year extends BaseEntity {
  @Column({ type: 'int' })
  year: number;

  @OneToMany(() => FuenteYear, (fuenteYear) => fuenteYear.year)
  fuenteYears: FuenteYear[];

  @OneToMany(
    () => YearDesegregacion,
    (yearDesegregacion) => yearDesegregacion.year,
  )
  yearDesegregaciones: YearDesegregacion[];
}
