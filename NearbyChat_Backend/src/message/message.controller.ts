import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  // GET /messages/:zoneId
  @Get(':zoneId')
  async getMessages(@Param('zoneId') zoneId: string) {
    const messages = await this.messageService.getMessagesByZone(zoneId);
    // Formater la réponse pour inclure le username au lieu de l'entité entière (facultatif mais plus propre)
    return messages.map(msg => ({
      id: msg.id,
      text: msg.text,
      username: msg.user.username,
      createdAt: msg.createdAt,
    })).reverse(); // Pour les afficher du plus ancien au plus récent au frontend
  }
}
