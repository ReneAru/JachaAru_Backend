import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Desegregacion } from './desegregacion.entity';
import { TipoDesegregacionIndicador } from './tipo-desegregacion-indicador.entity';

@Entity('tipo_desegregacion')
export class TipoDesegregacion extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  tipoDesg: string;

  @OneToMany(
    () => Desegregacion,
    (desegregacion) => desegregacion.tipoDesegregacion,
  )
  desegregaciones: Desegregacion[];

  @OneToMany(
    () => TipoDesegregacionIndicador,
    (tipoDesIndicador) => tipoDesIndicador.tipoDesegregacion,
  )
  tipoDesegregacionIndicadores: TipoDesegregacionIndicador[];
}
