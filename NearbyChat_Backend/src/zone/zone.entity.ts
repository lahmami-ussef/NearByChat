import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'; // Importe les types de TypeORM
import { Polygon } from 'geojson'; // Importe le type pour les formes GPS

@Entity('zones') // Nom de la table SQL
export class Zone { // Classe représentant une zone géographique
  @PrimaryGeneratedColumn('uuid') // ID unique auto-généré
  id: string; // Identifiant de la zone

  @Column() // Colonne texte standard
  name: string; // Nom de la zone

  @Column() // Colonne texte standard
  color: string; // Couleur de la zone (hexadécimal)

  @Column({ // Configuration de la colonne PostGIS
    type: 'geometry', // Type géospatial
    spatialFeatureType: 'Polygon', // Forme : Polygone (surface)
    srid: 4326, // Système GPS (WGS84)
  })
  polygon: Polygon; // Coordonnées GPS de la zone

  @CreateDateColumn() // Date auto-remplie à la création
  createdAt: Date; // Date de création
}
