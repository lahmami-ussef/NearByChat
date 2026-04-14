import { Module } from '@nestjs/common'; // Importe le décorateur de module
import { ConfigModule } from '@nestjs/config'; // Gère les variables d'environnement
import { TypeOrmModule } from '@nestjs/typeorm'; // Gère la base de données
import { AuthModule } from './auth/auth.module'; // Module d'authentification
import { UserModule } from './user/user.module'; // Module utilisateur
import { ZoneModule } from './zone/zone.module'; // Module des zones GPS
import { MessageModule } from './message/message.module'; // Module des messages
import { ChatModule } from './chat/chat.module'; // Module du chat temps réel

@Module({ // Définition du module racine
  imports: [ // Liste des modules importés
    ConfigModule.forRoot({ // Charge le fichier .env
      isGlobal: true, // Disponible dans toute l'application
    }),

    TypeOrmModule.forRoot({ // Configuration de la base de données
      type: 'postgres', // Type de SQL utilisé
      host: process.env.DB_HOST || 'localhost', // Adresse du serveur DB
      port: parseInt(process.env.DB_PORT, 10) || 5432, // Port du serveur DB
      username: process.env.DB_USER || 'nearbychat', // Utilisateur DB
      password: process.env.DB_PASSWORD || 'nearbychat_pass', // Mot de passe DB
      database: process.env.DB_NAME || 'nearbychat_db', // Nom de la base
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Chemin des modèles
      synchronize: true, // Création auto des tables (Dév uniquement)
    }),

    AuthModule, // Module logique auth
    UserModule, // Module logique user
    ZoneModule, // Module logique zone
    MessageModule, // Module logique message
    ChatModule, // Module logique chat
  ],
})
export class AppModule { } // Classe du module racine
