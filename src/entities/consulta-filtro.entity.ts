import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Usuario } from './usuario.entity';
import { Investigador } from './investigador.entity';
import { Filtro } from './filtro.entity';
import { RespuestaConsultaFiltro } from './respuesta-consulta-filtro.entity';

@Entity('consulta_filtro')
export class ConsultaFiltro extends BaseEntity {
  @Column({ name: 'usuario_id' })
  usuarioId: number;

  @Column({ name: 'filtro_id' })
  filtroId: number;

  @Column({ name: 'investigador_id' })
  investigadorId: number;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.consultasFiltros)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Filtro, (filtro) => filtro.consultasFiltros)
  @JoinColumn({ name: 'filtro_id' })
  filtro: Filtro;

  @ManyToOne(
    () => Investigador,
    (investigador) => investigador.consultasFiltros,
  )
  @JoinColumn({ name: 'investigador_id' })
  investigador: Investigador;

  @OneToMany(
    () => RespuestaConsultaFiltro,
    (respuesta) => respuesta.consultaFiltro,
  )
  respuestas: RespuestaConsultaFiltro[];
}
