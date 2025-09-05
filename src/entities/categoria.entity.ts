import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tema } from './tema.entity';
import { InvestigadorArea } from './investigador-area.entity';
import { Filtro } from './filtro.entity';

@Entity('categoria')
export class Categoria extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  categoria: string;

  @OneToMany(() => Tema, (tema) => tema.categoria)
  temas: Tema[];

  @OneToMany(
    () => InvestigadorArea,
    (investigadorArea) => investigadorArea.categoria,
  )
  investigadorAreas: InvestigadorArea[];

  @OneToMany(() => Filtro, (filtro) => filtro.categoria)
  filtros: Filtro[];
}
