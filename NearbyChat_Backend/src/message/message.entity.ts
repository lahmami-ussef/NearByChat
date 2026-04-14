import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'; // Outils TypeORM
import { User } from '../user/user.entity'; // Import de l'auteur
import { Zone } from '../zone/zone.entity'; // Import de la zone

@Entity('messages') // Nom de la table SQL
export class Message { // Classe représentant un message
  @PrimaryGeneratedColumn('uuid') // ID unique auto-généré
  id: string; // Identifiant du message

  @Column('text') // Colonne de texte long
  text: string; // Contenu du message

  @ManyToOne(() => User) // Un message a un seul auteur
  @JoinColumn({ name: 'userId' }) // Nom de la colonne de liaison
  user: User; // Objet User associé

  @ManyToOne(() => Zone) // Un message appartient à une seule zone
  @JoinColumn({ name: 'zoneId' }) // Nom de la colonne de liaison
  zone: Zone; // Objet Zone associé

  @CreateDateColumn() // Date auto-générée
  createdAt: Date; // Date d'envoi
}
