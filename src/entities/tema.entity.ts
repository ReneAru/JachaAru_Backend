import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Categoria } from './categoria.entity';
import { IndicadorTema } from './indicador-tema.entity';
import { Filtro } from './filtro.entity';

@Entity('tema')
@Index(['categoriaId'])
export class Tema extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  tema: string;

  @Column({ name: 'categoria_id' })
  categoriaId: number;

  @ManyToOne(() => Categoria, (categoria) => categoria.temas)
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

  @OneToMany(() => IndicadorTema, (indicadorTema) => indicadorTema.tema)
  indicadorTemas: IndicadorTema[];

  @OneToMany(() => Filtro, (filtro) => filtro.tema)
  filtros: Filtro[];
}
