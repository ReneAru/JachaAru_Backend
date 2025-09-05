import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ConsultaCompleja } from './consulta-compleja.entity';

@Entity('respuesta_consulta_compleja')
export class RespuestaConsultaCompleja extends BaseEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costo: number;

  @Column({ name: 'consulta_compleja_id' })
  consultaComplejaId: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  documento: string;

  @ManyToOne(
    () => ConsultaCompleja,
    (consultaCompleja) => consultaCompleja.respuestas,
  )
  @JoinColumn({ name: 'consulta_compleja_id' })
  consultaCompleja: ConsultaCompleja;
}
