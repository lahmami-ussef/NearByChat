import { Injectable, BadRequestException } from '@nestjs/common'; // Décorateurs et exceptions
import { InjectRepository } from '@nestjs/typeorm'; // Injection du dépôt
import { Repository } from 'typeorm'; // Type de dépôt SQL
import { Zone } from './zone.entity'; // Entité Zone

@Injectable() // Classe injectable
export class ZoneService { // Service gérant les zones GPS
  private userLocations = new Map<string, { lat: number; lon: number; timestamp: number }>(); 
  // Stockage tempo des positions

  constructor(
    @InjectRepository(Zone) // Injection de la table zones
    private readonly zoneRepository: Repository<Zone>, // Accès aux données
  ) {}

  async resolveZone(latitude: number, longitude: number, userId?: string): Promise<Zone | null> {
     // Trouve ou crée une zone
    if (userId) { // Si un utilisateur est connecté
      if (!this.validateSpeed(userId, latitude, longitude)) { // Vérifie s'il ne triche pas (vitesse)
        throw new BadRequestException('Vitesse trop élevée - coordonnées invalides'); // Erreur si TP
      }
      this.userLocations.set(userId, { lat: latitude, lon: longitude, timestamp: Date.now() });
       // Sauve la position
    }

    let zone = await this.zoneRepository // Cherche en base
      .createQueryBuilder('zone') // Outil de requête complexe
      .where("ST_Contains(zone.polygon, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326))", {
         // Fonctions spatiales SQL
        lon: longitude, // Paramètre longitude
        lat: latitude, // Paramètre latitude
      })
      .getOne(); // Récupère le résultat

    if (!zone) { // Si aucune zone n'existe ici
      const step = 0.01; // Taille du carré de zone (environ 1km)
      const baseLat = Math.floor(latitude / step) * step; // Arrondi de la latitude
      const baseLon = Math.floor(longitude / step) * step; // Arrondi de la longitude
      const genName = `Zone ${Math.abs(baseLat).toFixed(2)},${Math.abs(baseLon).toFixed(2)}`; // Nom généré

      zone = await this.zoneRepository.findOne({ where: { name: genName } }); // Revérifie le nom
      
      if (!zone) { // Si vraiment nouvelle zone
        const colors = ['#0A84FF', '#4ECDC4', '#FFE66D', '#A8E6CF', '#FF8A5B', '#8338EC']; // Couleurs possibles
        const randomColor = colors[Math.floor(Math.random() * colors.length)]; // Couleur aléatoire
        
        const newZone = this.zoneRepository.create({ // Crée l'objet zone
          name: genName, // Nom
          color: randomColor, // Couleur
          polygon: { // Forme géométrique
            type: 'Polygon' as const, // Type polygone
            coordinates: [ // Liste des points du carré
              [
                [baseLon, baseLat],
                [baseLon + step, baseLat],
                [baseLon + step, baseLat + step],
                [baseLon, baseLat + step],
                [baseLon, baseLat]
              ]
            ]
          },
        });
        zone = await this.zoneRepository.save(newZone); // Sauvegarde en base
      }
    }
    return zone; // Renvoie la zone trouvée ou créée
  }

  async getAllZonesWithUserCount(activeUsersByZone: Record<string, number> = {}): Promise<any[]> {
     // Liste zones + users
    const zones = await this.zoneRepository.find(); // Récupère tout
    return zones.map(zone => ({ // Formate le résultat
      ...zone, // Données de la zone
      userCount: activeUsersByZone[zone.id] || 0, // Ajoute le nombre d'actifs
    }));
  }

  private validateSpeed(userId: string, newLat: number, newLon: number): boolean { // Anti-triche (vitesse)
    const lastLocation = this.userLocations.get(userId); // Ancienne position
    if (!lastLocation) return true; // Si 1ère fois, ok

    const timeDiff = (Date.now() - lastLocation.timestamp) / 1000; // Temps écoulé en sec
    if (timeDiff === 0) return true; // Évite division par 0

    const distanceMeters = this.getDistanceFromLatLonInM( // Calcul distance en mètres
      lastLocation.lat,
      lastLocation.lon,
      newLat,
      newLon,
    );

    const speedKmh = (distanceMeters / 1000) / (timeDiff / 3600); // Vitesse en km/h
    return speedKmh <= 200; // Limite à 200 km/h
  }

  private getDistanceFromLatLonInM(lat1: number, lon1: number, lat2: number, lon2: number) { 
    // Calcul distance GPS
    const R = 6371e3; // Rayon de la terre
    const dLat = this.deg2rad(lat2 - lat1); // Diff latitude
    const dLon = this.deg2rad(lon2 - lon1); // Diff longitude
    const a = // Formule mathématique (Haversine)
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Angle
    return R * c; // Résultat final
  }

  private deg2rad(deg: number) { // Convertit degrés en radians
    return deg * (Math.PI / 180); // Calcul math
  }
}
