import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TipoDesegregacion } from './tipo-desegregacion.entity';
import { YearDesegregacion } from './year-desegregacion.entity';
import { Filtro } from './filtro.entity';

@Entity('desegregacion')
@Index(['tipoDesegregacionId'])
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

  @OneToMany(() => Filtro, (filtro) => filtro.desegregacion)
  filtros: Filtro[];
}
