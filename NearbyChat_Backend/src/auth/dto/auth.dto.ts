import { IsString, MinLength } from 'class-validator';

/**
 * DTO (Data Transfer Object) : Définit la forme des données qui arrivent dans les requêtes.
 * Il sert à la fois à typer le code et à valider les entrées utilisateur.
 */
export class AuthDto {
  /**
   * Le nom d'utilisateur doit être une chaîne de caractères (IsString)
   * et faire au moins 3 caractères (MinLength).
   */
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  username: string;

  /**
   * Le mot de passe doit être une chaîne (IsString)
   * et faire au moins 6 caractères (MinLength).
   */
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
