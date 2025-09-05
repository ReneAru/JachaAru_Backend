import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Fuente } from './fuente.entity';
import { FichaMetodologica } from './ficha-metodologica.entity';

@Entity('ficha_fuente')
export class FichaFuente extends BaseEntity {
  @Column({ name: 'fuente_id' })
  fuenteId: number;

  @Column({ name: 'ficha_metodologica_id' })
  fichaMetodologicaId: number;

  @ManyToOne(() => Fuente, (fuente) => fuente.fichaFuentes)
  @JoinColumn({ name: 'fuente_id' })
  fuente: Fuente;

  @ManyToOne(
    () => FichaMetodologica,
    (fichaMetodologica) => fichaMetodologica.fichaFuentes,
  )
  @JoinColumn({ name: 'ficha_metodologica_id' })
  fichaMetodologica: FichaMetodologica;
}
