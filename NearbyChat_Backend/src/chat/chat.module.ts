import { Module } from '@nestjs/common'; // Décorateur de module
import { ChatGateway } from './chat.gateway'; // Import de la passerelle temps réel
import { ZoneModule } from '../zone/zone.module'; // Import nécessaire pour le GPS
import { MessageModule } from '../message/message.module'; // Import nécessaire pour l'historique
import { AuthModule } from '../auth/auth.module'; // Import nécessaire pour la sécurité (JWT)

@Module({ // Déclaration du module de Chat
  imports: [ZoneModule, MessageModule, AuthModule], // Dépendances externes nécessaires
  providers: [ChatGateway], // Déclare la passerelle comme fournisseur
})
export class ChatModule {} // Classe du module Chat
