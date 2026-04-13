import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

// Entité TypeORM représentant la table "users"
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password?: string; // Optionnel car on ne le retourne pas toujours

  @Column({ nullable: true })
  avatarUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}
