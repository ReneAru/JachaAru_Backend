import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Indicador } from './indicador.entity';
import { TipoDesegregacion } from './tipo-desegregacion.entity';

@Entity('tipo_desegregacion_indicador')
export class TipoDesegregacionIndicador extends BaseEntity {
  @Column({ name: 'indicador_id' })
  indicadorId: number;

  @Column({ name: 'tipo_desegregacion_id' })
  tipoDesegregacionId: number;

  @ManyToOne(
    () => Indicador,
    (indicador) => indicador.tipoDesegregacionIndicadores,
  )
  @JoinColumn({ name: 'indicador_id' })
  indicador: Indicador;

  @ManyToOne(
    () => TipoDesegregacion,
    (tipoDesegregacion) => tipoDesegregacion.tipoDesegregacionIndicadores,
  )
  @JoinColumn({ name: 'tipo_desegregacion_id' })
  tipoDesegregacion: TipoDesegregacion;
}
