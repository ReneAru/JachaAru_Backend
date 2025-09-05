import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Usuario } from './usuario.entity';
import { Filtro } from './filtro.entity';
import { RespuestaConsultaRapida } from './respuesta-consulta-rapida.entity';

@Entity('consulta_rapida')
export class ConsultaRapida extends BaseEntity {
  @Column({ name: 'usuario_id' })
  usuarioId: number;

  @Column({ name: 'filtro_id' })
  filtroId: number;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.consultasRapidas)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Filtro, (filtro) => filtro.consultasRapidas)
  @JoinColumn({ name: 'filtro_id' })
  filtro: Filtro;

  @OneToMany(
    () => RespuestaConsultaRapida,
    (respuesta) => respuesta.consultaRapida,
  )
  respuestas: RespuestaConsultaRapida[];
}
