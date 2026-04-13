import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Zone } from '../zone/zone.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  text: string;

  // Relation ManyToOne: un message appartient à un utilisateur
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  // Relation ManyToOne: un message appartient à une zone
  @ManyToOne(() => Zone)
  @JoinColumn({ name: 'zoneId' })
  zone: Zone;

  @CreateDateColumn()
  createdAt: Date;
}
