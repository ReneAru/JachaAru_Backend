import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ConsultaRapida } from './consulta-rapida.entity';

@Entity('respuesta_consulta_rapida')
export class RespuestaConsultaRapida extends BaseEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costo: number;

  @Column({ name: 'consulta_rapida_id' })
  consultaRapidaId: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  documento: string;

  @ManyToOne(
    () => ConsultaRapida,
    (consultaRapida) => consultaRapida.respuestas,
  )
  @JoinColumn({ name: 'consulta_rapida_id' })
  consultaRapida: ConsultaRapida;
}
