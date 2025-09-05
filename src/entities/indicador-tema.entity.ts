import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tema } from './tema.entity';
import { Indicador } from './indicador.entity';

@Entity('indicador_tema')
export class IndicadorTema extends BaseEntity {
  @Column({ name: 'tema_id' })
  temaId: number;

  @Column({ name: 'indicador_id' })
  indicadorId: number;

  @ManyToOne(() => Tema, (tema) => tema.indicadorTemas)
  @JoinColumn({ name: 'tema_id' })
  tema: Tema;

  @ManyToOne(() => Indicador, (indicador) => indicador.indicadorTemas)
  @JoinColumn({ name: 'indicador_id' })
  indicador: Indicador;
}
