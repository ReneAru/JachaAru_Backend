import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ConsultaFiltro } from './consulta-filtro.entity';

@Entity('respuesta_consulta_filtro')
export class RespuestaConsultaFiltro extends BaseEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costo: number;

  @Column({ name: 'consulta_filtro_id' })
  consultaFiltroId: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  documento: string;

  @ManyToOne(
    () => ConsultaFiltro,
    (consultaFiltro) => consultaFiltro.respuestas,
  )
  @JoinColumn({ name: 'consulta_filtro_id' })
  consultaFiltro: ConsultaFiltro;
}
