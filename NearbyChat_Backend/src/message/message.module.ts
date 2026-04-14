import { Module } from '@nestjs/common'; // Décorateur module
import { TypeOrmModule } from '@nestjs/typeorm'; // Lien avec la DB
import { Message } from './message.entity'; // Import entité Message
import { MessageService } from './message.service'; // Import service local
import { MessageController } from './message.controller'; // Import contrôleur local
import { ScheduleModule } from '@nestjs/schedule'; // Pour les tâches répétitifs (CRON)

@Module({ // Déclaration module Message
  imports: [
    TypeOrmModule.forFeature([Message]), // Lie la table 'messages' au module
    ScheduleModule.forRoot(), // Initialise le système de tâches planifiées
  ],
  controllers: [MessageController], // Déclare les routes HTTP
  providers: [MessageService], // Déclare la logique métier
  exports: [MessageService], // Partage le service avec ChatGateway
})
export class MessageModule {} // Classe module Message
