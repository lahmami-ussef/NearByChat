import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
 // Importe les outils de TypeORM

@Entity('users') // Nom de la table en base de données
export class User { // Classe représentant un utilisateur
  @PrimaryGeneratedColumn('uuid') // Clé primaire auto-générée (format UUID)
  id: string; // Identifiant unique

  @Column({ unique: true }) // Colonne SQL, doit être unique
  username: string; // Nom d'affichage de l'utilisateur

  @Column() // Colonne SQL standard
  password?: string; // Mot de passe (optionnel dans les retours API)

  @Column({ nullable: true }) // Colonne SQL pouvant être vide
  avatarUrl: string; // Lien vers l'image de profil

  @CreateDateColumn() // Remplit auto la date de création
  createdAt: Date; // Date d'inscription
}
