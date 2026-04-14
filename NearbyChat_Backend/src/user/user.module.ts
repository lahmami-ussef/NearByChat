import { Module } from '@nestjs/common'; // Décorateur pour déclarer le module
import { TypeOrmModule } from '@nestjs/typeorm'; // Import pour lier TypeORM au module
import { UserController } from './user.controller'; // Import du contrôleur local
import { UserService } from './user.service'; // Import du service local
import { User } from './user.entity'; // Import de l'entité User

@Module({ // Déclaration du module utilisateur
  imports: [TypeOrmModule.forFeature([User])], // Enregistre la table User pour ce module
  controllers: [UserController], // Déclare le contrôleur HTTP
  providers: [UserService], // Déclare le service pour l'injection
  exports: [UserService], // Permet à d'autres modules (ex: Auth) d'utiliser UserService
})
export class UserModule {} // Classe représentant le module utilisateur
