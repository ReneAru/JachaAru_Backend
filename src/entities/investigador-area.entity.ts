import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Categoria } from './categoria.entity';
import { Investigador } from './investigador.entity';

@Entity('investigador_area')
export class InvestigadorArea extends BaseEntity {
  @Column({ name: 'categoria_id' })
  categoriaId: number;

  @Column({ name: 'investigador_id' })
  investigadorId: number;

  @ManyToOne(() => Categoria, (categoria) => categoria.investigadorAreas)
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

  @ManyToOne(
    () => Investigador,
    (investigador) => investigador.investigadorAreas,
  )
  @JoinColumn({ name: 'investigador_id' })
  investigador: Investigador;
}
