import { IsString, MinLength } from 'class-validator'; // Outils de validation

export class AuthDto { // Modèle de données pour l'authentification
  @IsString() // Doit être du texte
  @MinLength(3, { message: 'Username must be at least 3 characters' }) // Minimum 3 caractères
  username: string; // Nom d'utilisateur

  @IsString() // Doit être du texte
  @MinLength(6, { message: 'Password must be at least 6 characters' }) // Minimum 6 caractères
  password: string; // Mot de passe
}
