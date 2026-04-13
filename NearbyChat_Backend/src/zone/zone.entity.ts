import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { Polygon } from 'geojson'; 

/**
 * L'Entité représente une table dans la base de données PostgreSQL.
 * @Entity('zones') indique que cette classe correspond à la table "zones".
 */
@Entity('zones')
export class Zone {
  // Clé primaire générée automatiquement sous format UUID (identifiant unique)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Nom de la zone (ex: "Zone 33.57,-7.60")
  @Column()
  name: string;

  // Couleur hexadécimale pour l'affichage sur la carte ou l'UI
  @Column()
  color: string;

  /**
   * Champ spatial (Géométrie) utilisant PostGIS.
   * - type: 'geometry' -> Stockage de données géographiques.
   * - spatialFeatureType: 'Polygon' -> La zone est définie par un polygone (surface).
   * - srid: 4326 -> Utilise le système de coordonnées standard GPS (WGS84).
   */
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Polygon',
    srid: 4326,
  })
  polygon: Polygon;

  // Enregistre automatiquement la date et l'heure de création
  @CreateDateColumn()
  createdAt: Date;
}
