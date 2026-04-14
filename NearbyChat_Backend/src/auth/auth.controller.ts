import { Controller, Post, Body } from '@nestjs/common'; // Décorateurs pour les routes et le corps
import { AuthService } from './auth.service'; // Service d'authentification
import { AuthDto } from './dto/auth.dto'; // Modèle de données (DTO)

@Controller('auth') // Préfixe des routes : /auth
export class AuthController { // Gère les requêtes HTTP d'auth
  constructor(private readonly authService: AuthService) {} // Injecte le service auth

  @Post('register') // Route POST /auth/register
  async register(@Body() authDto: AuthDto) { // Inscription utilisateur
    return this.authService.register(authDto.username, authDto.password); // Appel service register
  }

  @Post('login') // Route POST /auth/login
  async login(@Body() authDto: AuthDto) { // Connexion utilisateur
    return this.authService.login(authDto.username, authDto.password); // Appel service login
  }
}
