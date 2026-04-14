import { Module } from '@nestjs/common'; // Décorateur de module
import { TypeOrmModule } from '@nestjs/typeorm'; // Lien avec la base de données
import { Zone } from './zone.entity'; // Import de l'entité Zone
import { ZoneService } from './zone.service'; // Import du service de calcul GPS
import { ZoneController } from './zone.controller'; // Import du contrôleur HTTP

@Module({ // Déclaration du module Zone
  imports: [TypeOrmModule.forFeature([Zone])], // Lie la table 'zones' au module
  controllers: [ZoneController], // Déclare les routes HTTP
  providers: [ZoneService], // Déclare la logique métier
  exports: [ZoneService], // Partage le service avec les autres modules (Chat/Message)
})
export class ZoneModule {} // Classe du module Zone
