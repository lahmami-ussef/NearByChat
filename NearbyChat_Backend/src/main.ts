import { NestFactory } from '@nestjs/core'; // Importe le cœur de Nest
import { AppModule } from './app.module'; // Importe le module racine
import { ValidationPipe } from '@nestjs/common'; // Importe l'outil de validation

async function bootstrap() { // Fonction de démarrage
  const app = await NestFactory.create(AppModule); // Crée l'instance de l'app

  app.useGlobalPipes(new ValidationPipe({ // Active la validation globale
    whitelist: true, // Supprime les données non autorisées
    transform: true, // Convertit auto les types (ex: string -> number)
  }));

  app.enableCors(); // Autorise les requêtes externes (frontend)
  
  await app.listen(process.env.PORT || 3000, '0.0.0.0'); // Lance le serveur
}

bootstrap(); // Exécute le démarrage
