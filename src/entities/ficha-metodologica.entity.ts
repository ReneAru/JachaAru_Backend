import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { FichaFuente } from './ficha-fuente.entity';

@Entity('ficha_metodologica')
export class FichaMetodologica extends BaseEntity {
  @Column({ type: 'int' })
  ficha: number;

  @OneToMany(() => FichaFuente, (fichaFuente) => fichaFuente.fichaMetodologica)
  fichaFuentes: FichaFuente[];
}
