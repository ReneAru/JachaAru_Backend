import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TipoDesegregacion } from './tipo-desegregacion.entity';
import { YearDesegregacion } from './year-desegregacion.entity';

@Entity('desegregacion')
export class Desegregacion extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  desagregacion: string;

  @Column({ name: 'tipo_desegregacion_id' })
  tipoDesegregacionId: number;

  @ManyToOne(
    () => TipoDesegregacion,
    (tipoDesegregacion) => tipoDesegregacion.desegregaciones,
  )
  @JoinColumn({ name: 'tipo_desegregacion_id' })
  tipoDesegregacion: TipoDesegregacion;

  @OneToMany(
    () => YearDesegregacion,
    (yearDesegregacion) => yearDesegregacion.desegregacion,
  )
  yearDesegregaciones: YearDesegregacion[];
}
