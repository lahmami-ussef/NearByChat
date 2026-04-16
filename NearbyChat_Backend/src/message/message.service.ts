import { Injectable } from '@nestjs/common'; // Décorateur injectable
import { InjectRepository } from '@nestjs/typeorm'; // Outil d'injection du dépôt
import { Repository } from 'typeorm'; // Type de dépôt SQL
import { Message } from './message.entity'; // Entité Message
import { Cron, CronExpression } from '@nestjs/schedule'; // Outils pour les tâches programmées
import { LessThan } from 'typeorm'; // Opérateur de comparaison SQL

@Injectable() // Classe injectable
export class MessageService { // Service gérant les messages
  constructor(
    @InjectRepository(Message) // Injection de la table messages
    private readonly messageRepository: Repository<Message>, // Accès aux données
  ) {}

  async createMessage(text: string, userId: string, zoneId: string): Promise<Message> { // Crée un message
    const message = this.messageRepository.create({ // Prépare l'objet
      text, // Texte du message
      user: { id: userId }, // Lien avec l'auteur
      zone: { id: zoneId }, // Lien avec la zone
    });
    const savedMessage = await this.messageRepository.save(message);
    // Sauvegarde SQL
    return this.messageRepository.findOneOrFail({ 
      // Récupère le message complet
      where: { id: savedMessage.id }, // Par son ID
      relations: ['user'], // Avec les infos de l'auteur
    });
  }

  async getMessagesByZone(zoneId: string): Promise<Message[]> { 
    // Récupère l'historique
    return this.messageRepository.find({ // Cherche en base
      where: { zone: { id: zoneId } }, // Pour une zone précise
      relations: ['user'], // Avec les noms d'auteurs
      order: { createdAt: 'DESC' }, // Du plus récent au plus ancien
      take: 50, // Limité à 50 messages
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // Tâche automatique (minuit)
  async clearOldMessages() { // Supprime les vieux messages
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); 
    // Calcul date (-24h)
    await this.messageRepository.delete({ // Suppression SQL
      createdAt: LessThan(twentyFourHoursAgo), // Si plus vieux que 24h
    });
    console.log('Cleaned messages older than 24h'); // Log de confirmation
  }
}
