import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

/**
 * Fonction principale qui démarre l'application NestJS.
 */
async function bootstrap() {
  // Crée une instance de l'application en utilisant le module racine (AppModule)
  const app = await NestFactory.create(AppModule);

  /**
   * ValidationPipe : Vérifie automatiquement les données envoyées par l'utilisateur (DTO).
   * - whitelist: true -> Supprime les champs qui ne sont pas définis dans le DTO.
   * - transform: true -> Convertit automatiquement les types (ex: string vers number).
   */
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  /**
   * EnableCors : Autorise les requêtes provenant d'autres domaines (utile pour React Native/Web).
   */
  app.enableCors();
  
  // Définit le port d'écoute (par défaut 3000) et l'adresse IP (0.0.0.0 pour l'accès externe)
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}

// Lancement effectif de l'application
bootstrap();
