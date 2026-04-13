import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ZoneModule } from './zone/zone.module';
import { MessageModule } from './message/message.module';
import { ChatModule } from './chat/chat.module';

/**
 * Le Module principale (Root Module) de l'application.
 * C'est ici que l'on rassemble tous les autres modules du projet.
 */
@Module({
  imports: [
    /**
     * ConfigModule : Permet de charger les variables d'environnement (.env).
     * isGlobal: true rend la configuration accessible partout sans import supplémentaire.
     */
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    /**
     * TypeOrmModule : Gère la connexion à la base de données PostgreSQL.
     */
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USER || 'nearbychat',
      password: process.env.DB_PASSWORD || 'nearbychat_pass',
      database: process.env.DB_NAME || 'nearbychat_db',
      // Recherche automatiquement les fichiers .entity.ts pour créer les tables
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // Synchronisation automatique des tables avec le code (uniquement pour le développement)
      synchronize: true, 
    }),

    // Import des modules de fonctionnalités de l'application
    AuthModule,
    UserModule,
    ZoneModule,
    MessageModule,
    ChatModule,
  ],
})
export class AppModule {}
