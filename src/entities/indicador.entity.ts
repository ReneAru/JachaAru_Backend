import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { IndicadorTema } from './indicador-tema.entity';
import { TipoDesegregacionIndicador } from './tipo-desegregacion-indicador.entity';

@Entity('indicador')
export class Indicador extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  indicador: string;

  @OneToMany(() => IndicadorTema, (indicadorTema) => indicadorTema.indicador)
  indicadorTemas: IndicadorTema[];

  @OneToMany(
    () => TipoDesegregacionIndicador,
    (tipoDesIndicador) => tipoDesIndicador.indicador,
  )
  tipoDesegregacionIndicadores: TipoDesegregacionIndicador[];
}
