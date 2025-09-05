import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Categoria } from './categoria.entity';
import { Tema } from './tema.entity';
import { Indicador } from './indicador.entity';
import { Desegregacion } from './desegregacion.entity';
import { Year } from './year.entity';
import { Fuente } from './fuente.entity';
import { FichaMetodologica } from './ficha-metodologica.entity';
import { ConsultaFiltro } from './consulta-filtro.entity';
import { ConsultaRapida } from './consulta-rapida.entity';

@Entity('filtro')
export class Filtro extends BaseEntity {
  @Column({ name: 'categoria_id' })
  categoriaId: number;

  @Column({ name: 'tema_id' })
  temaId: number;

  @Column({ name: 'indicador_id' })
  indicadorId: number;

  @Column({ name: 'desegregacion_id' })
  desegregacionId: number;

  @Column({ name: 'year_id' })
  yearId: number;

  @Column({ name: 'fuente_id' })
  fuenteId: number;

  @Column({ name: 'ficha_metodologica_id' })
  fichaMetodologicaId: number;

  @ManyToOne(() => Categoria)
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

  @ManyToOne(() => Tema)
  @JoinColumn({ name: 'tema_id' })
  tema: Tema;

  @ManyToOne(() => Indicador)
  @JoinColumn({ name: 'indicador_id' })
  indicador: Indicador;

  @ManyToOne(() => Desegregacion)
  @JoinColumn({ name: 'desegregacion_id' })
  desegregacion: Desegregacion;

  @ManyToOne(() => Year)
  @JoinColumn({ name: 'year_id' })
  year: Year;

  @ManyToOne(() => Fuente)
  @JoinColumn({ name: 'fuente_id' })
  fuente: Fuente;

  @ManyToOne(() => FichaMetodologica)
  @JoinColumn({ name: 'ficha_metodologica_id' })
  fichaMetodologica: FichaMetodologica;

  @OneToMany(() => ConsultaFiltro, (consultaFiltro) => consultaFiltro.filtro)
  consultasFiltros: ConsultaFiltro[];

  @OneToMany(() => ConsultaRapida, (consultaRapida) => consultaRapida.filtro)
  consultasRapidas: ConsultaRapida[];
}
