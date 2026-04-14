import { Controller, Get, Param, UseGuards } from '@nestjs/common'; // Décorateurs NestJS
import { MessageService } from './message.service'; // Import du service Message
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Protection par token

@UseGuards(JwtAuthGuard) // Sécurité active pour tout le contrôleur
@Controller('messages') // Chemin de base : /messages
export class MessageController { // Gère les requêtes HTTP messages
  constructor(private readonly messageService: MessageService) {} // Injecte le service Message

  @Get(':zoneId') // Route GET /messages/:zoneId
  async getMessages(@Param('zoneId') zoneId: string) { // Récupère l'historique d'une zone
    const messages = await this.messageService.getMessagesByZone(zoneId); // Appel service
    return messages.map(msg => ({ // Formate les données pour le client
      id: msg.id, // ID message
      text: msg.text, // Contenu texte
      username: msg.user.username, // Nom de l'auteur
      createdAt: msg.createdAt, // Date d'envoi
    })).reverse(); // Renverse l'ordre pour l'affichage (chronologique)
  }
}
