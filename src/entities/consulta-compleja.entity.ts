import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Usuario } from './usuario.entity';
import { Investigador } from './investigador.entity';
import { RespuestaConsultaCompleja } from './respuesta-consulta-compleja.entity';

@Entity('consulta_compleja')
export class ConsultaCompleja extends BaseEntity {
  @Column({ type: 'varchar', length: 1000 })
  consulta: string;

  @Column({ name: 'usuario_id' })
  usuarioId: number;

  @Column({ name: 'investigador_id' })
  investigadorId: number;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.consultasComplejas)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(
    () => Investigador,
    (investigador) => investigador.consultasComplejas,
  )
  @JoinColumn({ name: 'investigador_id' })
  investigador: Investigador;

  @OneToMany(
    () => RespuestaConsultaCompleja,
    (respuesta) => respuesta.consultaCompleja,
  )
  respuestas: RespuestaConsultaCompleja[];
}
