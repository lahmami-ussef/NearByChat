import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
// Import du Cron pour supprimer les vieux messages
import { Cron, CronExpression } from '@nestjs/schedule';
import { LessThan } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  // Sauvegarder un nouveau message
  async createMessage(text: string, userId: string, zoneId: string): Promise<Message> {
    const message = this.messageRepository.create({
      text,
      user: { id: userId },
      zone: { id: zoneId },
    });
    // Sauvegarder et recharger les relations pour pouvoir retourner le username
    const savedMessage = await this.messageRepository.save(message);
    return this.messageRepository.findOneOrFail({
      where: { id: savedMessage.id },
      relations: ['user'],
    });
  }

  // Récupérer les 50 derniers messages d'une zone (triés par création)
  async getMessagesByZone(zoneId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: { zone: { id: zoneId } },
      relations: ['user'], // inclure l'info utilisateur
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  // Cron Job Optionnel : Supprimer les messages de plus de 24h
  // S'exécute par défaut tous les jours à minuit
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async clearOldMessages() {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await this.messageRepository.delete({
      createdAt: LessThan(twentyFourHoursAgo),
    });
    console.log('Cleaned messages older than 24h');
  }
}
