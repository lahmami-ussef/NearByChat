import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

/**
 * Le Contrôleur gère les requêtes HTTP (l'aiguillage des routes).
 * Ici, toutes les routes commencent par /auth (ex: /auth/register).
 */
@Controller('auth')
export class AuthController {
  /**
   * Le constructeur permet d'injecter (DI) le service AuthService pour l'utiliser.
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Déroute vers l'inscription d'un nouvel utilisateur.
   * @Post('register') crée une route HTTP POST /auth/register.
   * @Body() récupère le corps de la requête et le valide via AuthDto.
   */
  @Post('register')
  async register(@Body() authDto: AuthDto) {
    // Appelle la méthode d'inscription dans le service AuthService
    return this.authService.register(authDto.username, authDto.password);
  }

  /**
   * Gère la connexion de l'utilisateur.
   * @Post('login') crée une route HTTP POST /auth/login.
   */
  @Post('login')
  async login(@Body() authDto: AuthDto) {
    // Appelle la méthode de connexion dans le service AuthService
    return this.authService.login(authDto.username, authDto.password);
  }
}
